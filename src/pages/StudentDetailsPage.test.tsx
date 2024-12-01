// FILE: src/pages/StudentDetailsPage.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { useCourseStore } from "../store/useCourseStore";
import { useAuthStore } from "../store/useAuthStore";
import { StudentDetailsPage } from "./StudentDetailsPage";

// Mock the Zustand stores
jest.mock("../store/useCourseStore");
jest.mock("../store/useAuthStore");

const mockUseCourseStore = useCourseStore as jest.MockedFunction<
  typeof useCourseStore
>;
const mockUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;

describe("StudentDetailsPage", () => {
  beforeEach(() => {
    mockUseCourseStore.mockReturnValue({
      courses: [
        {
          id: "course1",
          name: "Course 1",
          students: [
            {
              id: "student1",
              firstName: "John",
              lastName: "Doe",
              email: "john.doe@example.com",
              grades: [
                { examName: "Exam 1", score: 85 },
                { examName: "Exam 2", score: 90 },
              ],
              finalGrade: 87.5,
              performanceMetrics: { attendance: 95, participation: 80 },
            },
          ],
        },
      ],
    });

    mockUseAuthStore.mockReturnValue({
      user: { role: "teacher", email: "teacher@example.com" },
    });
  });

  it("renders student details correctly", () => {
    render(
      <Router>
        <StudentDetailsPage />
      </Router>
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Course 1")).toBeInTheDocument();
    expect(screen.getByText("Total de Puntos")).toBeInTheDocument();
    expect(screen.getByText("87.5")).toBeInTheDocument();
  });

  it("shows performance metrics editor button for teachers", () => {
    render(
      <Router>
        <StudentDetailsPage />
      </Router>
    );

    expect(
      screen.getByText("Editar Métricas de Rendimiento")
    ).toBeInTheDocument();
  });

  it("does not show performance metrics editor button for students", () => {
    mockUseAuthStore.mockReturnValueOnce({
      user: { role: "student", email: "john.doe@example.com" },
    });

    render(
      <Router>
        <StudentDetailsPage />
      </Router>
    );

    expect(
      screen.queryByText("Editar Métricas de Rendimiento")
    ).not.toBeInTheDocument();
  });

  it("renders charts correctly", () => {
    render(
      <Router>
        <StudentDetailsPage />
      </Router>
    );

    expect(screen.getByText("Progreso en el Curso")).toBeInTheDocument();
    expect(screen.getByText("Análisis de Rendimiento")).toBeInTheDocument();
  });
});
