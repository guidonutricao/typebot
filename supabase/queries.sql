-- Queries úteis para administração do Supabase

-- Ver todos os usuários e seus perfis
SELECT 
  u.id,
  u.email,
  u.created_at as user_created_at,
  p.name,
  p.avatar_url,
  COUNT(f.id) as total_flows
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.flows f ON u.id = f.user_id
GROUP BY u.id, u.email, u.created_at, p.name, p.avatar_url
ORDER BY u.created_at DESC;

-- Ver todos os fluxos com informações do usuário
SELECT 
  f.id,
  f.name,
  f.slug,
  f.is_published,
  f.created_at,
  f.updated_at,
  p.name as user_name,
  p.email as user_email,
  COUNT(fr.id) as total_responses
FROM public.flows f
JOIN public.profiles p ON f.user_id = p.id
LEFT JOIN public.form_responses fr ON f.id = fr.flow_id
GROUP BY f.id, f.name, f.slug, f.is_published, f.created_at, f.updated_at, p.name, p.email
ORDER BY f.updated_at DESC;

-- Ver fluxos publicados
SELECT 
  id,
  name,
  slug,
  created_at,
  updated_at
FROM public.flows
WHERE is_published = true
ORDER BY updated_at DESC;

-- Ver respostas de um fluxo específico
-- Substitua 'FLOW_ID' pelo ID do fluxo
SELECT 
  fr.id,
  fr.responses,
  fr.completed,
  fr.created_at,
  p.name as user_name,
  p.email as user_email
FROM public.form_responses fr
LEFT JOIN public.profiles p ON fr.user_id = p.id
WHERE fr.flow_id = 'FLOW_ID'
ORDER BY fr.created_at DESC;

-- Estatísticas gerais
SELECT 
  (SELECT COUNT(*) FROM auth.users) as total_users,
  (SELECT COUNT(*) FROM public.flows) as total_flows,
  (SELECT COUNT(*) FROM public.flows WHERE is_published = true) as published_flows,
  (SELECT COUNT(*) FROM public.form_responses) as total_responses,
  (SELECT COUNT(*) FROM public.form_responses WHERE completed = true) as completed_responses;

-- Fluxos mais respondidos
SELECT 
  f.id,
  f.name,
  f.slug,
  COUNT(fr.id) as response_count,
  COUNT(CASE WHEN fr.completed = true THEN 1 END) as completed_count
FROM public.flows f
LEFT JOIN public.form_responses fr ON f.id = fr.flow_id
GROUP BY f.id, f.name, f.slug
ORDER BY response_count DESC
LIMIT 10;

-- Usuários mais ativos (mais fluxos criados)
SELECT 
  p.id,
  p.name,
  p.email,
  COUNT(f.id) as flow_count
FROM public.profiles p
LEFT JOIN public.flows f ON p.id = f.user_id
GROUP BY p.id, p.name, p.email
ORDER BY flow_count DESC
LIMIT 10;

-- Limpar dados de teste (CUIDADO!)
-- Descomente apenas se tiver certeza
-- DELETE FROM public.form_responses;
-- DELETE FROM public.flows;
-- DELETE FROM public.profiles WHERE id NOT IN (SELECT id FROM auth.users);
