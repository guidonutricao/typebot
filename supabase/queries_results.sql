-- Queries úteis para a página de Resultados & Analytics

-- 1. Buscar todas as respostas de um fluxo específico
-- Substitua 'FLOW_ID_AQUI' pelo ID do fluxo
SELECT 
  id,
  flow_id,
  user_id,
  responses,
  completed,
  created_at,
  updated_at
FROM form_responses
WHERE flow_id = 'FLOW_ID_AQUI'
ORDER BY created_at DESC;

-- 2. Contar total de respostas por fluxo
SELECT 
  f.id as flow_id,
  f.name as flow_name,
  COUNT(fr.id) as total_responses,
  COUNT(CASE WHEN fr.completed = true THEN 1 END) as completed_responses,
  COUNT(CASE WHEN fr.completed = false THEN 1 END) as incomplete_responses
FROM flows f
LEFT JOIN form_responses fr ON f.id = fr.flow_id
WHERE f.user_id = auth.uid()
GROUP BY f.id, f.name
ORDER BY total_responses DESC;

-- 3. Respostas de hoje para um fluxo
SELECT 
  id,
  responses,
  completed,
  created_at
FROM form_responses
WHERE flow_id = 'FLOW_ID_AQUI'
  AND created_at >= CURRENT_DATE
ORDER BY created_at DESC;

-- 4. Taxa de conclusão por fluxo
SELECT 
  f.id,
  f.name,
  COUNT(fr.id) as total,
  COUNT(CASE WHEN fr.completed = true THEN 1 END) as completed,
  ROUND(
    (COUNT(CASE WHEN fr.completed = true THEN 1 END)::numeric / 
     NULLIF(COUNT(fr.id), 0) * 100), 
    2
  ) as completion_rate
FROM flows f
LEFT JOIN form_responses fr ON f.id = fr.flow_id
WHERE f.user_id = auth.uid()
GROUP BY f.id, f.name;

-- 5. Últimas 10 respostas de todos os fluxos do usuário
SELECT 
  fr.id,
  fr.flow_id,
  f.name as flow_name,
  fr.responses,
  fr.completed,
  fr.created_at
FROM form_responses fr
JOIN flows f ON fr.flow_id = f.id
WHERE f.user_id = auth.uid()
ORDER BY fr.created_at DESC
LIMIT 10;

-- 6. Estatísticas gerais de um usuário
SELECT 
  COUNT(DISTINCT f.id) as total_flows,
  COUNT(fr.id) as total_responses,
  COUNT(CASE WHEN fr.completed = true THEN 1 END) as completed_responses,
  COUNT(CASE WHEN fr.created_at >= CURRENT_DATE THEN 1 END) as responses_today
FROM flows f
LEFT JOIN form_responses fr ON f.id = fr.flow_id
WHERE f.user_id = auth.uid();

-- 7. Buscar respostas com filtro em campos específicos (exemplo: buscar por email)
-- Nota: Isso busca dentro do JSONB 'responses'
SELECT 
  id,
  flow_id,
  responses,
  completed,
  created_at
FROM form_responses
WHERE flow_id = 'FLOW_ID_AQUI'
  AND responses->>'email' ILIKE '%exemplo@email.com%'
ORDER BY created_at DESC;

-- 8. Extrair todas as chaves únicas das respostas de um fluxo
-- Útil para descobrir quais variáveis foram usadas
SELECT DISTINCT jsonb_object_keys(responses) as variable_name
FROM form_responses
WHERE flow_id = 'FLOW_ID_AQUI'
ORDER BY variable_name;

-- 9. Deletar resposta específica (com verificação de permissão)
DELETE FROM form_responses
WHERE id = 'RESPONSE_ID_AQUI'
  AND flow_id IN (
    SELECT id FROM flows WHERE user_id = auth.uid()
  );

-- 10. Exportar dados para CSV (via psql)
-- Execute no terminal psql:
-- \copy (SELECT * FROM form_responses WHERE flow_id = 'FLOW_ID_AQUI') TO '/path/to/export.csv' CSV HEADER;

-- NOTA: Todas as queries respeitam o Row Level Security (RLS)
-- Os usuários só podem ver respostas de seus próprios fluxos
