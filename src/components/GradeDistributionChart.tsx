import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { Course } from '../types/course';

interface GradeDistributionChartProps {
  course: Course;
}

export const GradeDistributionChart: React.FC<GradeDistributionChartProps> = ({ course }) => {
  const gradeRanges = [
    { name: '0-100', range: [0, 100], color: '#ef4444' },
    { name: '101-200', range: [101, 200], color: '#f97316' },
    { name: '201-300', range: [201, 300], color: '#eab308' },
    { name: '301-400', range: [301, 400], color: '#22c55e' },
    { name: '401-500', range: [401, 500], color: '#3b82f6' },
  ];

  const data = gradeRanges.map((range) => ({
    name: `${range.name} pts`,
    value: course.students.filter(
      (student) =>
        student.finalGrade >= range.range[0] &&
        student.finalGrade < range.range[1]
    ).length,
    color: range.color,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={({ name, percent }) => 
            percent > 0 ? `${name} (${(percent * 100).toFixed(0)}%)` : ''
          }
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};