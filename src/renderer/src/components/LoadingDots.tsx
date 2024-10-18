const LoadingDots = () => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="flex space-x-2">
        <div className="dot bg-gray-600 w-3 h-3 rounded-full animate-bounce1"></div>
        <div className="dot bg-gray-600 w-3 h-3 rounded-full animate-bounce2"></div>
        <div className="dot bg-gray-600 w-3 h-3 rounded-full animate-bounce3"></div>
      </div>
    </div>
  );
};


export default LoadingDots;