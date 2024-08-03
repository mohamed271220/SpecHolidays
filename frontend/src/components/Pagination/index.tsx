export type Props = {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ page, pages, onPageChange }: Props) => {
  const pageNumbers: number[] = [];
  for (let i = 1; i <= pages; i++) pageNumbers.push(i);
  return (
    <div className="flex justify-center">
      <ul className="flex border border-slate-300">
        {pageNumbers.map((pageNumber) => (
          <li
            className={`px-3 py-1 cursor-pointer ${page === pageNumber ? "bg-gray-200" : ""}`}
            onClick={() => onPageChange(pageNumber)}
          >
            <button>{pageNumber}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pagination;
