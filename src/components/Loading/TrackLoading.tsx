export default function TrackLoading({ length = 1 }: { length?: number }) {
  return (
    <>
      {[...Array(length)].map((_, index) => (
        <div className="flex items-center space-x-3 p-3" key={index}>
          <div className="w-12 h-12 rounded skeleton"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 rounded w-3/4 skeleton"></div>
            <div className="h-3 rounded w-1/2 skeleton"></div>
          </div>
        </div>
      ))}
    </>
  );
}
