export interface FlowVariable {
  id: string;
  name: string;
}

export interface RichTextChild {
  text: string;
  bold?: boolean;
  italic?: boolean;
}

export interface RichTextElement {
  type: string;
  children: RichTextChild[];
}

export interface TextBlock {
  id: string;
  type: 'text';
  content: {
    richText: RichTextElement[];
  };
  outgoingEdgeId?: string;
}

export interface ImageBlock {
  id: string;
  type: 'image';
  content: {
    url: string;
  };
  outgoingEdgeId?: string;
}

export interface TextInputBlock {
  id: string;
  type: 'text input';
  options: {
    labels: {
      placeholder: string;
      button: string;
    };
    variableId?: string;
    isLong?: boolean;
  };
  outgoingEdgeId?: string;
}

export interface NumberInputBlock {
  id: string;
  type: 'number input';
  options: {
    labels: {
      placeholder: string;
      button: string;
    };
    variableId?: string;
  };
  outgoingEdgeId?: string;
}

export interface ChoiceInputBlock {
  id: string;
  type: 'choice input';
  options: {
    isMultipleChoice?: boolean;
    buttonLabel?: string;
    dynamicVariableId?: string;
    variableId?: string;
  };
  items: Array<{
    id: string;
    type: string;
    blockId: string;
    content?: string;
    outgoingEdgeId?: string;
  }>;
  outgoingEdgeId?: string;
}

export interface SetVariableBlock {
  id: string;
  type: 'Set variable';
  options: {
    variableId: string;
    expressionToEvaluate: string;
  };
  outgoingEdgeId?: string;
}

export interface RedirectBlock {
  id: string;
  type: 'Redirect';
  options: {
    url: string;
  };
  outgoingEdgeId?: string;
}

export interface FileUploadBlock {
  id: string;
  type: 'file upload';
  options: {
    labels: {
      placeholder: string;
      button: string;
    };
    variableId?: string;
    isMultipleAllowed?: boolean;
  };
  outgoingEdgeId?: string;
}

export interface RatingBlock {
  id: string;
  type: 'rating';
  options: {
    length?: number;
    labels?: {
      left?: string;
      right?: string;
    };
    variableId?: string;
  };
  outgoingEdgeId?: string;
}

export type Block = 
  | TextBlock 
  | ImageBlock 
  | TextInputBlock 
  | NumberInputBlock
  | ChoiceInputBlock 
  | SetVariableBlock
  | RedirectBlock
  | FileUploadBlock
  | RatingBlock;

export interface Group {
  id: string;
  title: string;
  blocks: Block[];
}

export interface Edge {
  id: string;
  from: {
    blockId: string;
    itemId?: string;
  };
  to: {
    groupId: string;
    blockId?: string;
  };
}

export interface FlowData {
  version: string;
  name: string;
  groups: Group[];
  edges: Edge[];
  variables?: FlowVariable[];
}

export interface UserResponse {
  blockId: string;
  variableId?: string;
  value: string | string[];
  timestamp: Date;
}
