function getLineContainerNode(node: HTMLElement | null) {
  if (!node) return null;

  let lineContainerNode: HTMLElement | null = node;

  while (lineContainerNode && !lineContainerNode.hasAttribute('data-islinecontainer')) {
    lineContainerNode = lineContainerNode.parentElement;
  }

  return lineContainerNode;
}

function getOffsetInParentNode(node: Node | null, offset: number) {
  if (!node) return offset;

  let prevSibling = node.previousSibling;

  if (node.parentElement?.tagName.toLowerCase() !== 'pre') {
    prevSibling = node.parentElement?.previousSibling || null;
  }

  let parentOffset = offset;

  while (prevSibling) {
    parentOffset = parentOffset + (prevSibling.textContent?.length || 0);
    prevSibling = prevSibling.previousSibling;
  }

  return parentOffset;
}

export function getSelectionText() {
  const selection = document.getSelection();

  if (!selection) return undefined;

  const selectText = selection?.toString();

  // Return selectText directly while single line
  if(!selectText.includes('\n')) return selectText;

  // To remove line number and duration text while multiple lines
  let rangeCount = 0;

  let texts: string[] = [];

  while (rangeCount < selection.rangeCount) {
    const range = selection?.getRangeAt(rangeCount);

    const startNode = range.startContainer;
    const startLineContainer = getLineContainerNode(startNode.parentElement);
    const startOffset = getOffsetInParentNode(startNode, range.startOffset);
    const endNode = range.endContainer;
    const endLineContainer = getLineContainerNode(endNode.parentElement);
    const endOffset = getOffsetInParentNode(endNode, range.endOffset);

    let lineContainer = startLineContainer;

    while (lineContainer) {
      const text = lineContainer.querySelector('pre')?.textContent;

      if (text) {
        if (lineContainer === startLineContainer) {
          texts.push(text.slice(startOffset));
        } else if (lineContainer === endLineContainer) {
          texts.push(text.slice(0, endOffset));
        } else {
          texts.push(text);
        }
      }

      if (lineContainer === endLineContainer) break;

      lineContainer = lineContainer.nextElementSibling as HTMLElement;
    }

    rangeCount++;
  }

  return texts.join('\n');
}
