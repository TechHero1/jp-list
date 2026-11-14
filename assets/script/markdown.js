import MarkdownIt from 'https://esm.unpkg.com/markdown-it';

export const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: false
});

const proxy = (tokens, idx, options, env, self) => self.renderToken(tokens, idx, options);

const DEFAULT_LINK_RENDER = md.renderer.rules.link_open || proxy;

md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  tokens[idx].attrJoin('class', 'nota_link text-blue-500');
  tokens[idx].attrSet('target', '_blank');
  tokens[idx].attrSet('rel', 'noopener noreferrer');
  return DEFAULT_LINK_RENDER(tokens, idx, options, env, self);
};

const DEFAULT_HR_RENDER = md.renderer.rules.hr || proxy;

md.renderer.rules.hr = (tokens, idx, options, env, self) => {
  tokens[idx].attrJoin('class', 'my-4 opacity-25');
  return DEFAULT_HR_RENDER(tokens, idx, options, env, self);
};

const DEFAULT_BULLET_LIST_RENDER = md.renderer.rules.bullet_list_open || proxy;

md.renderer.rules.bullet_list_open = (tokens, idx, options, env, self) => {
  tokens[idx].attrJoin('class', 'list-[revert] p-[revert]');
  return DEFAULT_BULLET_LIST_RENDER(tokens, idx, options, env, self);
};

const DEFAULT_ORDERED_LIST_RENDER = md.renderer.rules.ordered_list_open || proxy;

md.renderer.rules.ordered_list_open = (tokens, idx, options, env, self) => {
  tokens[idx].attrJoin('class', 'list-[revert] p-[revert]');
  return DEFAULT_ORDERED_LIST_RENDER(tokens, idx, options, env, self);
};

const DEFAULT_HEADINGS_RENDER = md.renderer.rules.heading_open || proxy;

md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
  tokens[idx].attrJoin('class', '[font-size:revert] [font-weight:revert] mx-[revert] mt-0 mb-2');
  return DEFAULT_HEADINGS_RENDER(tokens, idx, options, env, self);
};

const DEFAULT_BLOCKQUOTE_RENDER = md.renderer.rules.blockquote_open || proxy;

md.renderer.rules.blockquote_open = (tokens, idx, options, env, self) => {
  tokens[idx].attrJoin('class', 'bg-white border-l-[5px] border-[#ddd] mb-4 pt-[10px] px-[20px] pb-[1px]');
  return DEFAULT_BLOCKQUOTE_RENDER(tokens, idx, options, env, self);
};

const DEFAULT_P_RENDER = md.renderer.rules.paragraph_open || proxy;

md.renderer.rules.paragraph_open = (tokens, idx, options, env, self) => {
  tokens[idx].attrJoin('class', 'mb-4');
  return DEFAULT_P_RENDER(tokens, idx, options, env, self);
};

const DEFAULT_CODE_INLINE_RENDER = md.renderer.rules.code_inline || proxy;

md.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
  tokens[idx].attrJoin('class', 'wrap-break-word bg-[#f5f5f5] border border-[#ccc] rounded-[4px] px-1' );
  return DEFAULT_CODE_INLINE_RENDER(tokens, idx, options, env, self);
};

const DEFAULT_CODE_BLOCK_RENDER = md.renderer.rules.code_block || proxy;

md.renderer.rules.code_block = (tokens, idx, options, env, self) => {
  tokens[idx].attrJoin('class', 'mt-0 mb-4 overflow-auto [font-size:.875em] p-[8px] bg-[#f5f5f5] border border-[#ccc] rounded-[4px]' );
  return DEFAULT_CODE_BLOCK_RENDER(tokens, idx, options, env, self);
};

const DEFAULT_FENCE_RENDER = md.renderer.rules.fence || proxy;

md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  tokens[idx].attrJoin('class', 'block mt-0 mb-4 overflow-auto [font-size:.875em] p-[8px] bg-[#f5f5f5] border border-[#ccc] rounded-[4px]' );
  return DEFAULT_FENCE_RENDER(tokens, idx, options, env, self);
};

const DEFAULT_IMAGE_RENDER = md.renderer.rules.image || proxy;

md.renderer.rules.image = (tokens, idx, options, env, self) => {
  tokens[idx].attrJoin('class', 'max-w-[33%] inline' );
  return DEFAULT_IMAGE_RENDER(tokens, idx, options, env, self);
};

const DEFAULT_TABLE_RENDER = md.renderer.rules.table_open || proxy;

md.renderer.rules.table_open = (tokens, idx, options, env, self) => {
  tokens[idx].attrJoin('class', 'border mb-4 table-auto' );
  return DEFAULT_TABLE_RENDER(tokens, idx, options, env, self);
};

const DEFAULT_TH_RENDER = md.renderer.rules.th_open || proxy;

md.renderer.rules.th_open = (tokens, idx, options, env, self) => {
  tokens[idx].attrJoin('class', 'border p-2' );
  return DEFAULT_TH_RENDER(tokens, idx, options, env, self);
};

const DEFAULT_TD_RENDER = md.renderer.rules.td_open || proxy;

md.renderer.rules.td_open = (tokens, idx, options, env, self) => {
  tokens[idx].attrJoin('class', 'border p-2' );
  return DEFAULT_TD_RENDER(tokens, idx, options, env, self);
};
