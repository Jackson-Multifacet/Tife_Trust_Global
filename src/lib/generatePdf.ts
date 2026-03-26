import jsPDF from "jspdf";

interface ApplicationData {
  firstName: string;
  middleName?: string;
  surname: string;
  title?: string;
  email: string;
  phone: string;
  gender?: string;
  maritalStatus?: string;
  dateOfBirth?: string;
  nationality?: string;
  occupation?: string;
  nin?: string;
  bvn?: string;
  residentialAddress?: string;
  cityTown?: string;
  stateOfResidence?: string;
  amountNeeded?: number;
  tenor?: string;
  bank?: string;
  accountNumber?: string;
  nokFirstName?: string;
  nokSurname?: string;
  nokRelationship?: string;
  nokPhone?: string;
  createdAt?: any;
  status?: string;
}

export const generateApplicationPDF = (application: ApplicationData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;

  let yPosition = margin;

  const addText = (
    text: string,
    x: number = margin,
    size: number = 12,
    bold: boolean = false,
    color: [number, number, number] = [0, 0, 0],
  ) => {
    doc.setFontSize(size);
    doc.setTextColor(...color);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.text(text, x, yPosition);
    yPosition += size / 2 + 2;
  };

  const addTextWithLabel = (
    label: string,
    value: string,
    x: number = margin,
    oneColumn: boolean = false,
  ) => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 102, 204);
    doc.text(label + ":", x, yPosition);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    const lines = doc.splitTextToSize(
      value || "N/A",
      oneColumn ? contentWidth - 2 * margin : contentWidth / 2 - margin - 5,
    );
    doc.text(lines, x + 50, yPosition);

    const lineHeight = lines.length > 1 ? lines.length * 4 : 5;
    yPosition += Math.max(6, lineHeight);
  };

  // Header
  doc.setFillColor(0, 102, 204);
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("TIFE TRUST GLOBAL", margin, 15);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Financial Services Portal", margin, 23);
  doc.text("Application Form", pageWidth - margin - 50, 23);

  yPosition = 50;

  // Title
  addText("APPLICATION DETAILS", margin, 14, true, [0, 102, 204]);
  yPosition += 5;

  // Personal Information
  addText("PERSONAL INFORMATION", margin, 12, true, [51, 51, 51]);
  yPosition += 3;

  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPosition - 2, pageWidth - margin, yPosition - 2);
  yPosition += 5;

  const columnX = margin + contentWidth / 2 + 5;
  addTextWithLabel(
    "Full Name",
    `${application.title || ""} ${application.firstName} ${application.middleName || ""} ${application.surname}`,
    margin,
  );
  addTextWithLabel("Gender", application.gender || "N/A", columnX);

  addTextWithLabel("Date of Birth", application.dateOfBirth || "N/A", margin);
  addTextWithLabel(
    "Marital Status",
    application.maritalStatus || "N/A",
    columnX,
  );

  addTextWithLabel("Nationality", application.nationality || "N/A", margin);
  addTextWithLabel("Occupation", application.occupation || "N/A", columnX);

  addTextWithLabel("NIN", application.nin || "N/A", margin);
  addTextWithLabel("BVN", application.bvn || "N/A", columnX);

  yPosition += 10;

  // Contact Information
  addText("CONTACT INFORMATION", margin, 12, true, [51, 51, 51]);
  yPosition += 3;
  doc.line(margin, yPosition - 2, pageWidth - margin, yPosition - 2);
  yPosition += 5;

  addTextWithLabel("Email", application.email, margin, true);
  addTextWithLabel("Phone", application.phone, margin);

  addTextWithLabel(
    "Residential Address",
    application.residentialAddress || "N/A",
    margin,
    true,
  );
  addTextWithLabel("City/Town", application.cityTown || "N/A", margin);
  addTextWithLabel("State", application.stateOfResidence || "N/A", columnX);

  // Check if we need a new page
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = margin;
  }

  yPosition += 5;

  // Financial Details
  addText("FINANCIAL DETAILS", margin, 12, true, [51, 51, 51]);
  yPosition += 3;
  doc.line(margin, yPosition - 2, pageWidth - margin, yPosition - 2);
  yPosition += 5;

  const amountFormatted = application.amountNeeded
    ? `₦${application.amountNeeded.toLocaleString()}`
    : "N/A";
  addTextWithLabel("Amount Needed", amountFormatted, margin);
  addTextWithLabel("Tenor", application.tenor || "N/A", columnX);

  addTextWithLabel("Bank", application.bank || "N/A", margin);
  addTextWithLabel(
    "Account Number",
    application.accountNumber || "N/A",
    columnX,
  );

  yPosition += 5;

  // Next of Kin
  addText("NEXT OF KIN", margin, 12, true, [51, 51, 51]);
  yPosition += 3;
  doc.line(margin, yPosition - 2, pageWidth - margin, yPosition - 2);
  yPosition += 5;

  addTextWithLabel(
    "Name",
    `${application.nokFirstName || ""} ${application.nokSurname || ""}`,
    margin,
  );
  addTextWithLabel(
    "Relationship",
    application.nokRelationship || "N/A",
    columnX,
  );

  addTextWithLabel("Phone", application.nokPhone || "N/A", margin);

  yPosition += 10;

  // Application Status
  addText("APPLICATION STATUS", margin, 12, true, [51, 51, 51]);
  yPosition += 3;
  doc.line(margin, yPosition - 2, pageWidth - margin, yPosition - 2);
  yPosition += 5;

  const statusColor =
    application.status === "approved"
      ? [34, 197, 94]
      : application.status === "rejected"
        ? [239, 68, 68]
        : [59, 130, 246];
  addTextWithLabel(
    "Status",
    application.status?.toUpperCase() || "PENDING",
    margin,
  );
  doc.setTextColor(...statusColor);
  doc.rect(margin + 50, yPosition - 8, 30, 6);
  doc.text(
    application.status?.toUpperCase() || "PENDING",
    margin + 52,
    yPosition - 3,
  );

  // Footer
  yPosition = pageHeight - 15;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Generated on ${new Date().toLocaleDateString()}`,
    margin,
    yPosition,
  );
  doc.text(
    `Page ${doc.internal.pages.length}`,
    pageWidth - margin - 20,
    yPosition,
  );

  return doc;
};

export const downloadApplicationPDF = (
  application: ApplicationData,
  filename?: string,
) => {
  const doc = generateApplicationPDF(application);
  const name =
    filename ||
    `${application.firstName}_${application.surname}_Application.pdf`;
  doc.save(name);
};

export const downloadApplicationCSV = (applications: ApplicationData[]) => {
  // CSV Header
  const headers = [
    "First Name",
    "Surname",
    "Email",
    "Phone",
    "Gender",
    "Date of Birth",
    "Occupation",
    "NIN",
    "BVN",
    "City",
    "State",
    "Amount Needed",
    "Tenor",
    "Bank",
    "Status",
    "Submitted Date",
  ];

  // CSV Data
  const rows = applications.map((app) => [
    app.firstName,
    app.surname,
    app.email,
    app.phone,
    app.gender || "",
    app.dateOfBirth || "",
    app.occupation || "",
    app.nin || "",
    app.bvn || "",
    app.cityTown || "",
    app.stateOfResidence || "",
    app.amountNeeded || "",
    app.tenor || "",
    app.bank || "",
    app.status || "pending",
    app.createdAt?.toDate?.().toLocaleDateString?.() ||
      new Date().toLocaleDateString(),
  ]);

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `applications_${new Date().getTime()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
