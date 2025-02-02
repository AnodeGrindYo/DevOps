import Navbar from "@/components/Navbar";
import DevOpsChecklist from "@/components/DevOpsChecklist";

export default function ChecklistPage() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar />
      <div className="container mx-auto p-10">
        <h1 className="text-4xl font-bold text-blue-400 text-center mb-6">✅ DevOps Checklist</h1>
        <DevOpsChecklist />
      </div>
    </div>
  );
}
