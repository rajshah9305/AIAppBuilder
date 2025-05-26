-- AI App Builder Database Schema
-- PostgreSQL Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar TEXT,
    subscription VARCHAR(20) DEFAULT 'free' CHECK (subscription IN ('free', 'pro', 'enterprise')),
    email_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- User usage tracking
CREATE TABLE user_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    month_year VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    generations_count INTEGER DEFAULT 0,
    tokens_used INTEGER DEFAULT 0,
    max_generations INTEGER DEFAULT 10,
    max_tokens INTEGER DEFAULT 100000,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, month_year)
);

-- AI Frameworks table
CREATE TABLE frameworks (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(10),
    pricing VARCHAR(20) DEFAULT 'free' CHECK (pricing IN ('free', 'premium')),
    speed VARCHAR(20) DEFAULT 'medium' CHECK (speed IN ('very_fast', 'fast', 'medium', 'slow')),
    enabled BOOLEAN DEFAULT TRUE,
    capabilities JSONB,
    config JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    prompt TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'completed', 'error')),
    frameworks JSONB, -- Array of framework IDs
    result JSONB, -- Generated result from AI frameworks
    metadata JSONB, -- Additional metadata like complexity, generation time, etc.
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Project generations (history of generation attempts)
CREATE TABLE project_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    frameworks JSONB NOT NULL,
    prompt TEXT NOT NULL,
    result JSONB,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
    error_message TEXT,
    generation_time_seconds INTEGER,
    tokens_used INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Framework usage statistics
CREATE TABLE framework_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    framework_id VARCHAR(50) NOT NULL REFERENCES frameworks(id),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    generation_id UUID REFERENCES project_generations(id) ON DELETE SET NULL,
    success BOOLEAN DEFAULT FALSE,
    execution_time_ms INTEGER,
    tokens_used INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- User sessions (for JWT token management)
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System logs
CREATE TABLE system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level VARCHAR(10) NOT NULL CHECK (level IN ('debug', 'info', 'warn', 'error')),
    message TEXT NOT NULL,
    metadata JSONB,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription ON users(subscription);
CREATE INDEX idx_user_usage_user_month ON user_usage(user_id, month_year);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_project_generations_project_id ON project_generations(project_id);
CREATE INDEX idx_project_generations_user_id ON project_generations(user_id);
CREATE INDEX idx_project_generations_status ON project_generations(status);
CREATE INDEX idx_framework_usage_user_id ON framework_usage(user_id);
CREATE INDEX idx_framework_usage_framework_id ON framework_usage(framework_id);
CREATE INDEX idx_framework_usage_created_at ON framework_usage(created_at DESC);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX idx_system_logs_level ON system_logs(level);
CREATE INDEX idx_system_logs_created_at ON system_logs(created_at DESC);

-- Triggers for updating updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_usage_updated_at BEFORE UPDATE ON user_usage
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_frameworks_updated_at BEFORE UPDATE ON frameworks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default frameworks
INSERT INTO frameworks (id, name, description, icon, pricing, speed, capabilities) VALUES
('openai', 'OpenAI GPT-4', 'Advanced language model for high-quality code generation and complex reasoning', '🤖', 'premium', 'medium', '["Code Generation", "Documentation", "Testing", "Debugging"]'),
('groq', 'Groq LLaMA', 'Ultra-fast inference for rapid prototyping and real-time code analysis', '⚡', 'free', 'very_fast', '["Fast Analysis", "Code Review", "Quick Prototyping"]'),
('crewai', 'CrewAI', 'Multi-agent system for collaborative development with specialized roles', '👥', 'free', 'medium', '["Multi-Agent Development", "Role-Based Tasks", "Collaboration"]'),
('metagpt', 'MetaGPT', 'Automated software development with comprehensive documentation', '📋', 'free', 'medium', '["Documentation", "Architecture Design", "Project Planning"]'),
('autogen', 'AutoGen', 'Conversational AI agents for iterative development and problem-solving', '🔄', 'free', 'medium', '["Iterative Development", "Problem Solving", "Code Refinement"]'),
('langchain', 'LangChain', 'Complex AI workflows and chain-of-thought reasoning for sophisticated apps', '🔗', 'free', 'slow', '["Complex Workflows", "Chain Reasoning", "Integration"]');

-- Create a view for user statistics
CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.email,
    u.name,
    u.subscription,
    u.created_at,
    COUNT(p.id) as total_projects,
    COUNT(CASE WHEN p.status = 'completed' THEN 1 END) as completed_projects,
    COUNT(pg.id) as total_generations,
    COALESCE(uu.generations_count, 0) as current_month_generations,
    COALESCE(uu.tokens_used, 0) as current_month_tokens
FROM users u
LEFT JOIN projects p ON u.id = p.user_id
LEFT JOIN project_generations pg ON u.id = pg.user_id
LEFT JOIN user_usage uu ON u.id = uu.user_id AND uu.month_year = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
GROUP BY u.id, u.email, u.name, u.subscription, u.created_at, uu.generations_count, uu.tokens_used;

-- Create a view for framework statistics
CREATE VIEW framework_stats AS
SELECT 
    f.id,
    f.name,
    COUNT(fu.id) as total_usage,
    COUNT(CASE WHEN fu.success = true THEN 1 END) as successful_usage,
    ROUND(AVG(fu.execution_time_ms), 2) as avg_execution_time_ms,
    SUM(fu.tokens_used) as total_tokens_used
FROM frameworks f
LEFT JOIN framework_usage fu ON f.id = fu.framework_id
GROUP BY f.id, f.name;

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM user_sessions WHERE expires_at < CURRENT_TIMESTAMP;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to reset monthly usage
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS INTEGER AS $$
DECLARE
    current_month VARCHAR(7);
    affected_count INTEGER;
BEGIN
    current_month := TO_CHAR(CURRENT_DATE, 'YYYY-MM');
    
    INSERT INTO user_usage (user_id, month_year, generations_count, tokens_used, max_generations, max_tokens)
    SELECT 
        u.id,
        current_month,
        0,
        0,
        CASE u.subscription
            WHEN 'free' THEN 10
            WHEN 'pro' THEN 100
            WHEN 'enterprise' THEN 1000
            ELSE 10
        END,
        CASE u.subscription
            WHEN 'free' THEN 100000
            WHEN 'pro' THEN 1000000
            WHEN 'enterprise' THEN 10000000
            ELSE 100000
        END
    FROM users u
    WHERE NOT EXISTS (
        SELECT 1 FROM user_usage uu 
        WHERE uu.user_id = u.id AND uu.month_year = current_month
    );
    
    GET DIAGNOSTICS affected_count = ROW_COUNT;
    RETURN affected_count;
END;
$$ LANGUAGE plpgsql;
