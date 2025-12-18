import { useState } from "react";
import { motion } from "framer-motion";
import StickyPageLayout from "../components/layouts/StickyPageLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { exportAnalyticsReport } from "../services/reportExportService";
import LoadingButton from "../components/ui/LoadingButton";
import toast from "react-hot-toast";

const ReportExport = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<
    "This Month" | "Last Month" | "Last 3 Months" | "Last 6 Months" | "This Year"
  >("This Month");

  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);
      //call the api to get the report blob(binary large object) / byte[]
      const fileBlob = await exportAnalyticsReport(selectedPeriod);

      // Create downloadable link (your existing code is perfect here)
      const url = window.URL.createObjectURL(
        new Blob([fileBlob], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
      );
      const link = document.createElement("a");
      link.href = url;
      // Fix: Use template literals for the filename
      link.download = `ExpenseVista_Report_${selectedPeriod}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Export successful! Your download has started.");

    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Export failed. Please try again.");

    } finally {
      setExporting(false);
    }
  };

  const header = (
    <>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-semibold text-gray-800">Export Reports</h2>
        <p className="text-gray-500 text-sm mb-4">
          Download your financial reports for offline use
        </p>
      </motion.div>


    </>
  );

  const exportCard = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      // These styles create the beautiful card effect
      className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-md border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-1">
        Configure Your Export
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        Choose a time period and format for your report.
      </p>

      {/* Time Period Selector */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Time Period
        </label>
        <Select
          value={selectedPeriod}
          onValueChange={(value) =>
            setSelectedPeriod(value as typeof selectedPeriod)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="This Month">This Month</SelectItem>
            <SelectItem value="Last Month">Last Month</SelectItem>
            <SelectItem value="Last 3 Months">Last 3 Months</SelectItem>
            <SelectItem value="Last 6 Months">Last 6 Months</SelectItem>
            <SelectItem value="This Year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Format Selector (Ready for the future!) */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Format
        </label>
        <div className="grid grid-cols-2 gap-3">
          {/* The active Excel button */}
          <button
            className="py-2.5 rounded-lg border-2 border-green-600 bg-green-50 text-green-700 font-semibold"
          >
            Excel (.xlsx)
          </button>

          {/* The disabled PDF button */}
          <button
            disabled
            className="py-2.5 rounded-lg border border-gray-300 text-gray-400 cursor-not-allowed"
          >
            PDF (Coming Soon)
          </button>
        </div>
      </div>

      {/* The Final Action Button */}
      <LoadingButton
        onClick={handleExport}
        loading={exporting}
        label="Download Report"
        loadingLabel="Generating Report…"
        className="w-full bg-green-600 hover:bg-green-700"
      />
    </motion.div>
  );

  return (
    <StickyPageLayout header={header} scrollable={false}>
      <div className="py-8 sm:py-12 px-4">
        {exportCard}
      </div>
    </StickyPageLayout>
  );
};

export default ReportExport;
