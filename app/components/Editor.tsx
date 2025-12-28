import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes } from "@lexical/html";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkNode } from "@lexical/link";
import { $setBlocksType } from "@lexical/selection";
import { 
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
} from "lexical";
import {
  $createHeadingNode,
} from "@lexical/rich-text";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
} from "@lexical/list";

// --- Theme Configuration ---
const theme = {
  paragraph: "mb-4 text-gray-800 dark:text-gray-300 leading-relaxed",
  heading: {
    h1: "text-3xl font-bold mb-4 mt-6 text-gray-900 dark:text-white",
    h2: "text-2xl font-bold mb-3 mt-5 text-gray-900 dark:text-white",
    h3: "text-xl font-bold mb-2 mt-4 text-gray-900 dark:text-white",
  },
  list: {
    ul: "list-disc list-outside mb-4 ml-6",
    ol: "list-decimal list-outside mb-4 ml-6",
    listitem: "mb-1",
  },
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    code: "bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded font-mono text-sm",
  },
  quote: "border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4",
};

function onError(error: any) {
  console.error(error);
}

// --- Toolbar Component ---
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  
  const formatText = (format: 'bold' | 'italic' | 'underline' | 'code') => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatHeading = (headingSize: 'h1' | 'h2' | 'h3') => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      }
    });
  };

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatList = (listType: 'bullet' | 'number') => {
    if (listType === 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  };

  const buttonClass = "px-3 py-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded transition-colors text-sm font-medium text-gray-700 dark:text-gray-200 min-w-[40px]";
  
  return (
    <div className="border-b border-gray-300 dark:border-gray-600 p-3 flex flex-wrap gap-1 bg-gray-50 dark:bg-gray-900">
      <button type="button" onClick={formatParagraph} className={buttonClass} title="Normal Text">
        Normal
      </button>
      
      <button type="button" onClick={() => formatText('bold')} className={buttonClass} title="Bold (Ctrl+B)">
        <strong className="font-bold">B</strong>
      </button>
      <button type="button" onClick={() => formatText('italic')} className={buttonClass} title="Italic (Ctrl+I)">
        <em className="italic">I</em>
      </button>
      <button type="button" onClick={() => formatText('underline')} className={buttonClass} title="Underline (Ctrl+U)">
        <u>U</u>
      </button>
      
      <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1 self-stretch"></div>
      
      <button type="button" onClick={() => formatHeading('h1')} className={buttonClass} title="Heading 1">
        H1
      </button>
      <button type="button" onClick={() => formatHeading('h2')} className={buttonClass} title="Heading 2">
        H2
      </button>
      <button type="button" onClick={() => formatHeading('h3')} className={buttonClass} title="Heading 3">
        H3
      </button>
      
      <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1 self-stretch"></div>
      
      <button type="button" onClick={() => formatList('bullet')} className={buttonClass} title="Bullet List">
        • List
      </button>
      <button type="button" onClick={() => formatList('number')} className={buttonClass} title="Numbered List">
        1. List
      </button>
    </div>
  );
}

// --- Helper to Extract HTML ---
function UpdateStatePlugin({ onChange }: { onChange: (html: string, json: string) => void }) {
  const [editor] = useLexicalComposerContext();
  return (
    <OnChangePlugin
      onChange={(editorState) => {
        editorState.read(() => {
          const html = $generateHtmlFromNodes(editor, null);
          const json = JSON.stringify(editorState);
          onChange(html, json);
        });
      }}
    />
  );
}

// --- The Main Component ---
export default function Editor({ onChange }: { onChange: (html: string, json: string) => void }) {
  const initialConfig = {
    namespace: "MyBlogEditor",
    theme,
    onError,
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode],
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div className="relative min-h-[300px]">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[300px] p-4 outline-none prose dark:prose-invert max-w-none" />
            }
            placeholder={
              <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
                Start writing your story...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <UpdateStatePlugin onChange={onChange} />
        </div>
      </LexicalComposer>
    </div>
  );
}
