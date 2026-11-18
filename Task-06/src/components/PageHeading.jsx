export default function PageHeading({ eyebrow, title, description, children }) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-600">
            {eyebrow}
          </p>
        )}
        <h1 className="text-[26px] font-bold tracking-tight text-slate-900 sm:text-[30px]">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  )
}
