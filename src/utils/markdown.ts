import { marked } from 'marked';

const renderMarkdown = (md: string) => marked.parse(md);
export default renderMarkdown;
