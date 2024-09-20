const LoadingSpinner = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  );
}

export default LoadingSpinner