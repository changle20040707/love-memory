-- ============================================
-- 💕 恋爱纪念网站 - Supabase 数据库初始化脚本
-- ============================================
-- 使用方法：
-- 1. 打开 https://supabase.com/dashboard
-- 2. 创建新项目（免费即可）
-- 3. 进入项目 -> SQL Editor
-- 4. 粘贴本文件全部内容并运行
-- ============================================

-- 1. 创建留言表
CREATE TABLE IF NOT EXISTS messages (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  author TEXT NOT NULL CHECK (char_length(author) >= 1 AND char_length(author) <= 20),
  content TEXT NOT NULL CHECK (char_length(content) >= 1 AND char_length(content) <= 500),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 创建索引（按时间倒序查询更快）
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages (created_at DESC);

-- 3. 开启行级安全（RLS）
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 4. 允许所有人读取留言（公开访问）
CREATE POLICY "允许所有人查看留言"
  ON messages FOR SELECT
  USING (true);

-- 5. 允许所有人创建留言（公开访问）
CREATE POLICY "允许所有人写留言"
  ON messages FOR INSERT
  WITH CHECK (true);

-- 6. 允许所有人删除留言（公开访问）
--    注意：留言板有确认弹窗，防止误删
CREATE POLICY "允许所有人删除留言"
  ON messages FOR DELETE
  USING (true);
