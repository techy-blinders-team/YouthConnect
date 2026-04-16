import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { YouthMemberManagementService, YouthMemberListItem } from '../../../services/youth-member-management.service';
import { CivilStatus, Gender } from '../../../models/enums';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ExcelJS from 'exceljs';

@Component({
  selector: 'app-youth-profiling',
  imports: [CommonModule, FormsModule],
  templateUrl: './youth-profiling.html',
  styleUrl: './youth-profiling.scss',
})
export class YouthProfiling implements OnInit {
  youthProfiles: YouthMemberListItem[] = [];
  filteredProfiles: YouthMemberListItem[] = [];
  searchQuery: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private youthMemberManagementService: YouthMemberManagementService) {}

  ngOnInit(): void {
    this.loadYouthProfiles();
  }

  loadYouthProfiles(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.youthMemberManagementService.getYouthProfiles().subscribe({
      next: (data: any) => {
        // Transform the response to match YouthMemberListItem
        this.youthProfiles = data.map((profile: any) => ({
          userId: profile.userId || 0,
          youthId: profile.youthId,
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email || '',
          gender: profile.gender as Gender,
          birthday: profile.birthday,
          contactNumber: profile.contactNumber,
          civilStatus: profile.civilStatus as CivilStatus,
          isActive: profile.isActive !== undefined ? profile.isActive : true,
          isApprove: profile.isApprove || null,
          createdAt: profile.createdAt,
          middleName: profile.middleName || null,
          suffix: profile.suffix || null,
          completeAddress: profile.completeAddress,
          youthClassification: profile.youthClassification ? {
            youthClassification: profile.youthClassification.youthClassification || null,
            educationBackground: profile.youthClassification.educationBackground || null,
            workStatus: profile.youthClassification.workStatus || null,
            skVoter: profile.youthClassification.skVoter || false,
            nationalVoter: profile.youthClassification.nationalVoter || false,
            pastVoter: profile.youthClassification.pastVoter || false,
            numAttended: profile.youthClassification.numAttended || 0,
            nonAttendedReason: profile.youthClassification.nonAttendedReason || null
          } : undefined
        }));
        this.filteredProfiles = [...this.youthProfiles];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading youth profiles:', error);
        this.errorMessage = 'Failed to load youth profiles. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.filteredProfiles = [...this.youthProfiles];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredProfiles = this.youthProfiles.filter(profile =>
      profile.firstName.toLowerCase().includes(query) ||
      profile.lastName.toLowerCase().includes(query) ||
      (profile.middleName && profile.middleName.toLowerCase().includes(query)) ||
      profile.contactNumber.toLowerCase().includes(query) ||
      (profile.completeAddress && profile.completeAddress.toLowerCase().includes(query)) ||
      profile.civilStatus.toLowerCase().includes(query)
    );
  }

  exportToPDF(): void {
    if (this.filteredProfiles.length === 0) {
      alert('No data to export');
      return;
    }

    const doc = new jsPDF('l', 'mm', 'a4'); // landscape orientation
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    let yPosition = margin;

    // Title
    doc.setFontSize(16);
    doc.text('Youth Profiles Report', margin, yPosition);
    yPosition += 15;

    // Metadata
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
    doc.text(`Total Records: ${this.filteredProfiles.length}`, pageWidth - 60, yPosition);
    yPosition += 10;

    // Table headers
    const headers = ['First Name', 'Last Name', 'Age', 'Gender', 'Contact', 'Civil Status', 'Classification', 'Education', 'Work Status'];
    const colWidth = (pageWidth - 2 * margin) / headers.length;

    doc.setFontSize(9);
    doc.setFillColor(0, 51, 102);
    doc.setTextColor(255, 255, 255);
    headers.forEach((header, index) => {
      doc.text(header, margin + index * colWidth + 2, yPosition, { maxWidth: colWidth - 2 });
    });
    yPosition += 8;

    // Table data
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.setFillColor(240, 240, 240);

    this.filteredProfiles.forEach((profile, rowIndex) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = margin;
        // Repeat headers
        doc.setFillColor(0, 51, 102);
        doc.setTextColor(255, 255, 255);
        headers.forEach((header, index) => {
          doc.text(header, margin + index * colWidth + 2, yPosition, { maxWidth: colWidth - 2 });
        });
        yPosition += 8;
        doc.setTextColor(0, 0, 0);
      }

      if (rowIndex % 2 === 0) {
        doc.setFillColor(240, 240, 240);
      } else {
        doc.setFillColor(255, 255, 255);
      }

      const rowData = [
        profile.firstName,
        profile.lastName,
        this.getAge(profile.birthday).toString(),
        profile.gender,
        profile.contactNumber,
        profile.civilStatus,
        profile.youthClassification?.youthClassification || 'N/A',
        profile.youthClassification?.educationBackground || 'N/A',
        profile.youthClassification?.workStatus || 'N/A'
      ];

      rowData.forEach((data, index) => {
        doc.text(data.substring(0, 8), margin + index * colWidth + 2, yPosition, { maxWidth: colWidth - 2 });
      });
      yPosition += 7;
    });

    doc.save('youth-profiles-report.pdf');
  }

  exportToExcel(): void {
    if (this.filteredProfiles.length === 0) {
      alert('No data to export');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Youth Profiles');

    // Define columns
    worksheet.columns = [
      { header: 'First Name', key: 'firstName', width: 15 },
      { header: 'Middle Name', key: 'middleName', width: 15 },
      { header: 'Last Name', key: 'lastName', width: 15 },
      { header: 'Suffix', key: 'suffix', width: 10 },
      { header: 'Age', key: 'age', width: 8 },
      { header: 'Gender', key: 'gender', width: 10 },
      { header: 'Birthday', key: 'birthday', width: 15 },
      { header: 'Contact Number', key: 'contactNumber', width: 15 },
      { header: 'Complete Address', key: 'completeAddress', width: 30 },
      { header: 'Civil Status', key: 'civilStatus', width: 12 },
      { header: 'Youth Classification', key: 'youthClassification', width: 20 },
      { header: 'Education Background', key: 'educationBackground', width: 20 },
      { header: 'Work Status', key: 'workStatus', width: 15 },
      { header: 'SK Voter', key: 'skVoter', width: 10 },
      { header: 'National Voter', key: 'nationalVoter', width: 12 },
      { header: 'Past Voter', key: 'pastVoter', width: 12 },
      { header: 'Assemblies Attended', key: 'numAttended', width: 15 },
      { header: 'Non-Attendance Reason', key: 'nonAttendedReason', width: 25 }
    ];

    // Style header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003366' } };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

    // Add data rows
    this.filteredProfiles.forEach((profile) => {
      worksheet.addRow({
        firstName: profile.firstName,
        middleName: profile.middleName || 'N/A',
        lastName: profile.lastName,
        suffix: profile.suffix || 'N/A',
        age: this.getAge(profile.birthday),
        gender: profile.gender,
        birthday: this.formatDate(profile.birthday),
        contactNumber: profile.contactNumber,
        completeAddress: profile.completeAddress || 'N/A',
        civilStatus: profile.civilStatus,
        youthClassification: profile.youthClassification?.youthClassification || 'N/A',
        educationBackground: profile.youthClassification?.educationBackground || 'N/A',
        workStatus: profile.youthClassification?.workStatus || 'N/A',
        skVoter: profile.youthClassification?.skVoter ? 'Yes' : 'No',
        nationalVoter: profile.youthClassification?.nationalVoter ? 'Yes' : 'No',
        pastVoter: profile.youthClassification?.pastVoter ? 'Yes' : 'No',
        numAttended: profile.youthClassification?.numAttended || 0,
        nonAttendedReason: profile.youthClassification?.nonAttendedReason || 'N/A'
      });
    });

    // Auto-fit columns and center data
    worksheet.eachRow((row) => {
      row.alignment = { horizontal: 'left', vertical: 'middle' };
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Save the workbook
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `youth-profiles-${new Date().getTime()}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
    });
  }

  getFullName(profile: YouthMemberListItem): string {
    const parts = [profile.firstName, profile.middleName, profile.lastName].filter(Boolean);
    return parts.join(' ');
  }

  getAge(birthday: string): number {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }
}
