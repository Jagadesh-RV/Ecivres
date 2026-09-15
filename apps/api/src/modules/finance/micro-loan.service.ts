import { Injectable, BadRequestException } from '@nestjs/common';
import { ApplyMicroLoanDto } from './dto/micro-loan.dto';

export interface MicroLoanDecision {
  loanId: string;
  providerId: string;
  requestedAmount: number;
  approvedAmount: number;
  interestRatePercentage: number;
  repaymentTermMonths: number;
  monthlyInstallment: number;
  status: 'APPROVED' | 'REJECTED' | 'MANUAL_REVIEW';
  riskScore: number;
}

@Injectable()
export class MicroLoanService {
  async evaluateAndIssueLoan(dto: ApplyMicroLoanDto): Promise<MicroLoanDecision> {
    const loanId = `loan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    // Risk score calculation based on simulated provider earnings history & term
    const baseRiskScore = 720;
    const termPenalty = dto.repaymentTermMonths * 5;
    const finalRiskScore = baseRiskScore - termPenalty;

    if (finalRiskScore < 600) {
      return {
        loanId,
        providerId: dto.providerId,
        requestedAmount: dto.requestedAmount,
        approvedAmount: 0,
        interestRatePercentage: 0,
        repaymentTermMonths: dto.repaymentTermMonths,
        monthlyInstallment: 0,
        status: 'REJECTED',
        riskScore: finalRiskScore,
      };
    }

    const interestRate = finalRiskScore > 700 ? 5.5 : 8.0;
    const approvedAmount = dto.requestedAmount;
    const totalRepayment = approvedAmount * (1 + (interestRate / 100) * (dto.repaymentTermMonths / 12));
    const monthlyInstallment = Math.round((totalRepayment / dto.repaymentTermMonths) * 100) / 100;

    return {
      loanId,
      providerId: dto.providerId,
      requestedAmount: dto.requestedAmount,
      approvedAmount,
      interestRatePercentage: interestRate,
      repaymentTermMonths: dto.repaymentTermMonths,
      monthlyInstallment,
      status: 'APPROVED',
      riskScore: finalRiskScore,
    };
  }
}
