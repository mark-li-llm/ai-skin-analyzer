export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          AI Skin Analyzer
        </h1>
        <p className="text-center text-lg mb-4">
          Upload a photo to analyze your skin type and get personalized sunscreen recommendations
        </p>
        <div className="flex justify-center">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <p className="text-gray-500">Upload functionality coming soon...</p>
          </div>
        </div>
      </div>
    </main>
  );
}
