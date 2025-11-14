import { useState, useCallback, useEffect, useRef } from 'react';
import { FlowData, Block, UserResponse, Group } from '@/types/flow';
import { interpolateVariables } from '@/utils/variableInterpolation';

export const useFlowNavigation = (flowData: FlowData | null) => {
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [variables, setVariables] = useState<Record<string, any>>({});
  const [variableNames, setVariableNames] = useState<Record<string, string>>({});
  
  // ✅ FIX: Usar ref para sempre ter o valor mais recente das variáveis
  const variablesRef = useRef<Record<string, any>>({});
  
  useEffect(() => {
    variablesRef.current = variables;
  }, [variables]);

  // Load saved progress and build variable name map
  useEffect(() => {
    console.log('[useFlowNavigation] Loading flowData:', {
      hasFlowData: !!flowData,
      hasVariables: !!flowData?.variables,
      variablesCount: flowData?.variables?.length || 0,
      variables: flowData?.variables
    });

    if (flowData?.variables) {
      const nameMap: Record<string, string> = {};
      flowData.variables.forEach(v => {
        nameMap[v.id] = v.name;
        console.log('[useFlowNavigation] Mapping variable:', { id: v.id, name: v.name });
      });
      setVariableNames(nameMap);
      console.log('[useFlowNavigation] Variable name map created:', nameMap);
    } else {
      console.warn('[useFlowNavigation] No variables found in flowData!');
    }

    const saved = localStorage.getItem('flow-progress');
    if (saved) {
      try {
        const { groupIndex, blockIndex, responses: savedResponses, variables: savedVars } = JSON.parse(saved);
        setCurrentGroupIndex(groupIndex);
        setCurrentBlockIndex(blockIndex);
        setResponses(savedResponses || []);
        setVariables(savedVars || {});
        console.log('[useFlowNavigation] Restored from localStorage:', { savedVars });
      } catch (e) {
        console.error('Error loading saved progress', e);
      }
    }
  }, [flowData]);

  // Save progress to localStorage
  useEffect(() => {
    if (flowData) {
      localStorage.setItem('flow-progress', JSON.stringify({
        groupIndex: currentGroupIndex,
        blockIndex: currentBlockIndex,
        responses,
        variables
      }));
    }
  }, [currentGroupIndex, currentBlockIndex, responses, variables, flowData]);

  const getCurrentBlock = useCallback((): Block | null => {
    if (!flowData || !flowData.groups[currentGroupIndex]) {
      return null;
    }
    return flowData.groups[currentGroupIndex].blocks[currentBlockIndex] || null;
  }, [flowData, currentGroupIndex, currentBlockIndex]);

  const findNextBlock = useCallback((outgoingEdgeId?: string, itemId?: string): { group: Group; blockIndex: number } | null => {
    if (!flowData || !outgoingEdgeId) return null;

    const edge = flowData.edges.find(e => 
      e.id === outgoingEdgeId && 
      (!itemId || e.from.itemId === itemId)
    );
    
    if (!edge) return null;

    const nextGroup = flowData.groups.find(g => g.id === edge.to.groupId);
    if (!nextGroup) return null;

    let blockIndex = 0;
    if (edge.to.blockId) {
      blockIndex = nextGroup.blocks.findIndex(b => b.id === edge.to.blockId);
      if (blockIndex === -1) blockIndex = 0;
    }

    return { group: nextGroup, blockIndex };
  }, [flowData]);

  const goToNextBlock = useCallback((outgoingEdgeId?: string, itemId?: string) => {
    const currentBlock = getCurrentBlock();
    const edgeId = outgoingEdgeId || currentBlock?.outgoingEdgeId;
    
    if (!flowData) return false;

    const next = findNextBlock(edgeId, itemId);
    
    if (next) {
      const groupIndex = flowData.groups.findIndex(g => g.id === next.group.id);
      setCurrentGroupIndex(groupIndex);
      setCurrentBlockIndex(next.blockIndex);
      return true;
    }

    // Try to go to next block in current group
    const currentGroup = flowData.groups[currentGroupIndex];
    if (currentGroup && currentBlockIndex < currentGroup.blocks.length - 1) {
      setCurrentBlockIndex(currentBlockIndex + 1);
      return true;
    }

    // Try to go to next group
    if (currentGroupIndex < flowData.groups.length - 1) {
      setCurrentGroupIndex(currentGroupIndex + 1);
      setCurrentBlockIndex(0);
      return true;
    }

    return false; // End of flow
  }, [flowData, currentGroupIndex, currentBlockIndex, getCurrentBlock, findNextBlock]);

  const addResponse = useCallback((blockId: string, value: string | string[], variableId?: string) => {
    const newResponse: UserResponse = {
      blockId,
      variableId,
      value,
      timestamp: new Date()
    };

    setResponses(prev => [...prev, newResponse]);

    // Update variable with both ID and readable name
    if (variableId) {
      const variableName = variableNames[variableId] || variableId;
      console.log('[useFlowNavigation] Adding variable:', {
        variableId,
        variableName,
        value,
        allVariableNames: variableNames,
        flowDataVariables: flowData?.variables
      });
      
      setVariables(prev => {
        const newVars = {
          ...prev,
          [variableId]: value,
          [variableName]: value // Also store by name for interpolation
        };
        console.log('[useFlowNavigation] Updated variables:', newVars);
        return newVars;
      });
    } else {
      console.warn('[useFlowNavigation] No variableId provided for response:', { blockId, value });
    }
  }, [variableNames, flowData]);

  const resetFlow = useCallback(() => {
    setCurrentGroupIndex(0);
    setCurrentBlockIndex(0);
    setResponses([]);
    setVariables({});
    localStorage.removeItem('flow-progress');
  }, []);

  const isFlowComplete = useCallback(() => {
    if (!flowData) return false;
    return currentGroupIndex >= flowData.groups.length - 1 &&
           currentBlockIndex >= (flowData.groups[currentGroupIndex]?.blocks.length || 0) - 1;
  }, [flowData, currentGroupIndex, currentBlockIndex]);

  const interpolateText = useCallback((text: string) => {
    // ✅ FIX: Usar variablesRef.current para sempre ter o valor mais recente
    console.log('[useFlowNavigation] interpolateText called with variables:', variablesRef.current);
    return interpolateVariables(text, variablesRef.current);
  }, []); // Sem dependências para sempre usar o ref mais recente

  return {
    currentBlock: getCurrentBlock(),
    currentGroup: flowData?.groups[currentGroupIndex],
    goToNextBlock,
    addResponse,
    responses,
    variables,
    resetFlow,
    isFlowComplete,
    interpolateText
  };
};
