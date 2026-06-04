import { AnalysisReport } from '../../../../src/modules/business-understanding/domain/analysis-report.entity';

describe('AnalysisReport Entity', () => {
  const mockDate = new Date('2025-01-01');

  const swotContent = {
    strengths: ['Brand recognition', 'Tech team'],
    weaknesses: ['Limited budget'],
    opportunities: ['New market'],
    threats: ['Competitors'],
  };

  const validProps = {
    id: 'report-1',
    type: 'SWOT' as const,
    title: 'Q1 SWOT Analysis',
    content: swotContent,
    summary: 'Strong position with growth potential',
    profileId: 'profile-1',
    userId: 'user-1',
    createdAt: mockDate,
  };

  it('should create an analysis report', () => {
    const report = new AnalysisReport(validProps);
    expect(report.type).toBe('SWOT');
    expect(report.title).toBe('Q1 SWOT Analysis');
    expect(report.content).toEqual(swotContent);
  });

  it('should detect analysis type correctly', () => {
    const swot = new AnalysisReport(validProps);
    const pestel = new AnalysisReport({ ...validProps, type: 'PESTEL' });
    const porter = new AnalysisReport({ ...validProps, type: 'PORTER' });
    const canvas = new AnalysisReport({ ...validProps, type: 'CANVAS' });

    expect(swot.isSwot()).toBe(true);
    expect(pestel.isPestel()).toBe(true);
    expect(porter.isPorter()).toBe(true);
    expect(canvas.isCanvas()).toBe(true);
  });
});
