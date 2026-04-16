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

    const doc = new jsPDF('l', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 5;
    const cellPaddingX = 0.8;
    const cellPaddingY = 1.1;
    const lineHeight = 3.4;
    let yPosition = 14;

    doc.setFontSize(16);
    doc.setFont('', 'bold');
    doc.text('YOUTH PROFILES REPORT', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(9);
    doc.setFont('', 'normal');
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US')} | Total Records: ${this.filteredProfiles.length}`, margin, yPosition);
    yPosition += 6;

    const headers = [
      'First Name', 'Middle Name', 'Last Name', 'Suffix', 'Age', 'Gender', 'Birthday', 'Contact', 'Address',
      'Civil Status', 'Classification', 'Education', 'Work Status', 'SK Voter', 'National Voter', 'Past Voter', 'Assemblies', 'Reason'
    ];
    const widthWeights = [1.25, 1.15, 1.25, 0.65, 0.55, 0.75, 1.05, 1.1, 2.2, 1.0, 1.3, 1.25, 1.05, 0.8, 0.95, 0.85, 0.85, 1.5];
    const totalWeight = widthWeights.reduce((sum, weight) => sum + weight, 0);
    const availableWidth = pageWidth - margin * 2;
    const colWidths = widthWeights.map((weight) => (weight / totalWeight) * availableWidth);

    const wrapText = (value: string, maxWidth: number): string[] => {
      const text = value?.trim() ? value : 'N/A';
      const lines = doc.splitTextToSize(text, maxWidth);
      return lines.length > 0 ? lines : ['N/A'];
    };

    const getRowMetrics = (values: string[], isHeader: boolean) => {
      doc.setFont('', isHeader ? 'bold' : 'normal');
      doc.setFontSize(isHeader ? 7.4 : 6.8);

      const wrapped = values.map((value, index) => wrapText(value, colWidths[index] - cellPaddingX * 2));
      const maxLines = wrapped.reduce((max, lines) => Math.max(max, lines.length), 1);
      const height = Math.max(6, maxLines * lineHeight + cellPaddingY * 2);

      return { wrapped, height };
    };

    const drawRow = (values: string[], isHeader: boolean, isStriped: boolean) => {
      const { wrapped, height } = getRowMetrics(values, isHeader);
      const rowTop = yPosition;
      const rowBottom = rowTop + height;

      if (isHeader) {
        doc.setFillColor(33, 66, 122);
        doc.rect(margin, rowTop, availableWidth, height, 'F');
      } else if (isStriped) {
        doc.setFillColor(245, 247, 250);
        doc.rect(margin, rowTop, availableWidth, height, 'F');
      }

      doc.setDrawColor(180, 190, 205);
      doc.setLineWidth(0.25);
      doc.line(margin, rowTop, margin + availableWidth, rowTop);
      doc.line(margin, rowBottom, margin + availableWidth, rowBottom);

      let x = margin;
      for (let i = 0; i < values.length; i++) {
        const colWidth = colWidths[i];

        doc.line(x, rowTop, x, rowBottom);

        doc.setFont('', isHeader ? 'bold' : 'normal');
        doc.setFontSize(isHeader ? 7.4 : 6.8);
        doc.setTextColor(isHeader ? 255 : 0, isHeader ? 255 : 0, isHeader ? 255 : 0);

        const textLines = wrapped[i];
        let textY = rowTop + cellPaddingY + lineHeight - 0.5;
        textLines.forEach((line) => {
          doc.text(line, x + cellPaddingX, textY, {
            maxWidth: colWidth - cellPaddingX * 2,
            align: 'left'
          });
          textY += lineHeight;
        });

        x += colWidth;
      }

      doc.line(margin + availableWidth, rowTop, margin + availableWidth, rowBottom);
      yPosition = rowBottom;
    };

    const drawHeader = () => {
      drawRow(headers, true, false);
    };

    drawHeader();

    this.filteredProfiles.forEach((profile, rowIndex) => {
      const rowData = [
        profile.firstName || 'N/A',
        profile.middleName || 'N/A',
        profile.lastName || 'N/A',
        profile.suffix || 'N/A',
        this.getAge(profile.birthday).toString(),
        profile.gender || 'N/A',
        profile.birthday ? profile.birthday.substring(0, 10) : 'N/A',
        profile.contactNumber || 'N/A',
        profile.completeAddress || 'N/A',
        profile.civilStatus || 'N/A',
        profile.youthClassification?.youthClassification || 'N/A',
        profile.youthClassification?.educationBackground || 'N/A',
        profile.youthClassification?.workStatus || 'N/A',
        profile.youthClassification?.skVoter ? 'Yes' : 'No',
        profile.youthClassification?.nationalVoter ? 'Yes' : 'No',
        profile.youthClassification?.pastVoter ? 'Yes' : 'No',
        (profile.youthClassification?.numAttended || 0).toString(),
        profile.youthClassification?.nonAttendedReason || 'N/A'
      ];

      const { height } = getRowMetrics(rowData, false);
      if (yPosition + height > pageHeight - 8) {
        doc.addPage();
        yPosition = 10;
        drawHeader();
      }

      drawRow(rowData, false, rowIndex % 2 === 0);
    });

    const dateTime = this.getFormattedDateTime();
    doc.save(`youth-profiles-report-${dateTime}.pdf`);
  }

  exportToExcel(): void {
    if (this.filteredProfiles.length === 0) {
      alert('No data to export');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Youth Profiles');

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

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003366' } };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

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

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const dateTime = this.getFormattedDateTime();
      link.download = `youth-profiles-report-${dateTime}.xlsx`;
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

  getFormattedDateTime(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
  }

  onEdit(profile: YouthMemberListItem): void {
    console.log('Edit profile:', profile);
    // TODO: Implement edit functionality
    // Navigate to edit page or open modal with profile data
    alert(`Edit profile for ${profile.firstName} ${profile.lastName}`);
  }

  onDeactivate(profile: YouthMemberListItem): void {
    const confirmed = confirm(`Are you sure you want to deactivate ${profile.firstName} ${profile.lastName}?`);
    if (confirmed) {
      console.log('Deactivate profile:', profile);
      // TODO: Implement deactivate functionality
      // Call service to deactivate profile
      alert(`Profile for ${profile.firstName} ${profile.lastName} has been deactivated.`);
      this.loadYouthProfiles(); // Reload the list
    }
  }
}
