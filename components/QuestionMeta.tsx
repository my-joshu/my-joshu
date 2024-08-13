type QuestionMetaType = {
  author: string;
  timestamp: string;
};

export const QuestionMeta = ({ author, timestamp }: QuestionMetaType) => (
  <div className="text-sm text-gray-500 dark:text-gray-400">
    {author} · {timestamp}
  </div>
);
