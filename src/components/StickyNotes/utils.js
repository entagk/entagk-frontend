export const validateContent = (content = []) => {
  const types = [
    "heading-one",
    "heading-two",
    "block-quote",
    "bulleted-list",
    "numbered-list",
    "list-item",
    "link",
    "paragraph"
  ];

  const styles = [
    "bold",
    "code",
    "italic",
    "underline",
    "subscript",
    "superscript",
    "strikethrough",
  ]

  if (content.length === 0)
    return false;

  let textLength = 0;
  if (!content instanceof Array) {
    return false;
  } else {
    for (const row of content) {
      if (!types.includes(row.type) || !row.children) {
        return false;
      }

      if (row.children.length === 0 || (row.children.length === 1 && row.children[0].text.trim().length === 0)) {
        return false;
      }

      if (row.type === "numbered-list" || row.type === "bulleted-list") {
        const validList = validateContent(row.children);
        if (!validList.validContent)
          return false;
        else textLength += validList.textLength;
      } else {
        for (const text of row.children) {
          const textStyles = Object.keys(text).filter(s => s !== 'text');
          if (!textStyles.every(sty => styles.includes(sty)))
            return false;
          textLength += text.text.trim().length;
        };
      }
    }
  }

  return textLength > 0 ? true : false;
}
