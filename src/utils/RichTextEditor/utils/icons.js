import {
  MdFormatBold,
  MdFormatItalic,
  MdStrikethroughS,
  MdFormatUnderlined,
  MdFormatQuote,
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
  MdFormatListNumbered,
  MdFormatListBulleted,
  MdInsertLink,
  MdAdd,
  MdFormatAlignJustify,
  MdOutlineLinkOff
} from "react-icons/md";
import { BsTypeH1, BsTypeH2, BsCodeSlash } from "react-icons/bs";
import { FaSuperscript, FaSubscript } from "react-icons/fa";

const icons = {
  bold: <MdFormatBold />,
  italic: <MdFormatItalic />,
  strikethrough: <MdStrikethroughS />,
  underline: <MdFormatUnderlined />,
  "heading-one": <BsTypeH1 />,
  "heading-two": <BsTypeH2 />,
  code: <BsCodeSlash />,
  "block-quote": <MdFormatQuote />,
  superscript: <FaSuperscript />,
  subscript: <FaSubscript />,
  "align-left": <MdFormatAlignLeft />,
  "align-center": <MdFormatAlignCenter />,
  "align-right": <MdFormatAlignRight />,
  "align-justify": <MdFormatAlignJustify />,

  "numbered-list": <MdFormatListNumbered />,
  "bulleted-list": <MdFormatListBulleted />,
  link: <MdInsertLink />,
  unlink: <MdOutlineLinkOff />,

  add: <MdAdd />
};

export default icons;
