export default function Footer() {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">
              {" "}
              GIG Worker Registration Portal
            </h3>
            {/* <p className="mb-4">Experience the thrill of Mutation.</p> */}
            <p>&copy; 2025. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
