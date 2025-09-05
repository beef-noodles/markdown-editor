import Prism from 'prismjs';

import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';

export const highlightCode = (content: string): string => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;

  const codeBlocks = tempDiv.querySelectorAll('pre code');

  codeBlocks.forEach((block) => {
    if (block instanceof HTMLElement) {
      const languageClass = Array.from(block.classList)
        .find(className => className.startsWith('language-'));

      if (languageClass) {
        const language = languageClass.replace('language-', '');
        try {
          const highlightedCode = Prism.highlight(
            block.textContent || '',
            Prism.languages[language] || Prism.languages.plaintext,
            language
          );
          block.innerHTML = highlightedCode;
        } catch (error) {
          console.warn(`Failed to highlight code block with language: ${language}`, error);
        }
      }
    }
  });

  return tempDiv.innerHTML;
};
