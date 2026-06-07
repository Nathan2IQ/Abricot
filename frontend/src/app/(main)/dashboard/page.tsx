import { redirect } from "next/navigation";
import DashboardHeader from "./_components/Header";
import ViewToggle from "./_components/ViewToggle";
import TasksSection from "./_components/TaskSection";
import { dashboardServerAPI } from "@/app/api/server-utils"; // ← CHANGER ICI

export default async function DashboardPage() {
  const user = await dashboardServerAPI.getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const tasks = await dashboardServerAPI.getAssignedTasks();

  return (
    <>
      <DashboardHeader userName={user.name} userEmail={user.email} />
      <ViewToggle />
      <TasksSection tasks={tasks} />
    </>
  );
}
