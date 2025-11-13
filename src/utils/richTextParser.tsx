import { RichTextElement } from "@/types/flow";

export const parseRichText = (richText: RichTextElement[]): React.ReactNode => {
  return richText.map((element, idx) => {
    const content = element.children.map((child, childIdx) => {
      let text = child.text;
      
      if (child.bold && child.italic) {
        return <strong key={childIdx}><em>{text}</em></strong>;
      }
      if (child.bold) {
        return <strong key={childIdx}>{text}</strong>;
      }
      if (child.italic) {
        return <em key={childIdx}>{text}</em>;
      }
      return <span key={childIdx}>{text}</span>;
    });

    if (element.type === 'p') {
      return <p key={idx} className="mb-2 last:mb-0">{content}</p>;
    }
    
    return <div key={idx}>{content}</div>;
  });
};
