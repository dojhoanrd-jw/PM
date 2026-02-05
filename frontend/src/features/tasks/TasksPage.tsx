'use client';

import { useMemo } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { api, type Task, type Project } from '@/lib/api';
import { useAlerts } from '@/context/AlertContext';
import { useTranslation } from '@/context/I18nContext';
import { getCurrentUser } from '@/lib/auth';
import { FILTER_SELECT_CLASSES, formatDate, getStatusOptions, getPriorityOptions } from '@/lib/constants';
import { useFilterState, useModalState } from '@/hooks';
import { Card, StatusBadge, PriorityBadge, Button, ConfirmDeleteModal, LoadingSpinner, EmptyState, DataTable, ActionButtons } from '@/components/ui';
import type { Column } from '@/components/ui';
import { PlusIcon, TasksIcon } from '@/components/icons';
import { TaskFormModal } from './components';

export default function TasksPage() {
  const { t, locale } = useTranslation();
  const { showSuccess } = useAlerts();
  const { mutate } = useSWRConfig();
  const currentUserRole = getCurrentUser()?.role;

  const statusOptions = useMemo(() => getStatusOptions(t), [t]);
  const priorityOptions = useMemo(() => getPriorityOptions(t), [t]);

  const { data: tasksData, isLoading: loadingTasks } = useSWR<{ tasks: Task[] }>('/tasks');
  const { data: projectsData, isLoading: loadingProjects } = useSWR<{ projects: Project[] }>('/projects');

  const loading = loadingTasks || loadingProjects;
  const tasks = tasksData?.tasks ?? [];
  const projects = projectsData?.projects ?? [];

  const modal = useModalState<Task>();

  const assignees = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of tasks) {
      if (t.assigneeId && !map.has(t.assigneeId)) {
        map.set(t.assigneeId, t.assigneeName);
      }
    }
    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [tasks]);

  const taskProjects = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of tasks) {
      if (t.projectId && !map.has(t.projectId)) {
        map.set(t.projectId, t.projectName);
      }
    }
    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [tasks]);

  const { filters, filtered: filteredTasks, updateFilter, clearFilters } = useFilterState(
    tasks,
    { status: 'all', priority: 'all', project: 'all', assignee: 'all' },
    (t, f) => {
      if (f.status !== 'all' && t.status !== f.status) return false;
      if (f.priority !== 'all' && t.priority !== f.priority) return false;
      if (f.project !== 'all' && t.projectId !== f.project) return false;
      if (f.assignee !== 'all' && t.assigneeId !== f.assignee) return false;
      return true;
    },
  );

  const revalidate = () => {
    mutate('/tasks');
    mutate('/projects');
  };

  const handleDelete = async () => {
    if (!modal.deleting) return;
    await api.deleteTask(modal.deleting.taskId, modal.deleting.projectId);
    showSuccess('Task deleted successfully');
    modal.closeDelete();
    revalidate();
  };

  const columns: Column<Task>[] = useMemo(() => [
    {
      header: t('table.title'),
      render: (task) => <span className="font-medium text-text-primary">{task.title}</span>,
    },
    {
      header: t('table.project'),
      render: (task) => <span className="text-text-secondary whitespace-nowrap">{task.projectName}</span>,
    },
    {
      header: t('table.assignee'),
      render: (task) => <span className="text-text-secondary whitespace-nowrap">{task.assigneeName}</span>,
    },
    {
      header: t('table.status'),
      render: (task) => <StatusBadge status={task.status} className="!text-[11px]" />,
    },
    {
      header: t('table.priority'),
      render: (task) => <PriorityBadge priority={task.priority} />,
    },
    {
      header: t('table.dueDate'),
      render: (task) => <span className="text-text-secondary whitespace-nowrap">{formatDate(task.dueDate, locale)}</span>,
    },
    {
      header: t('table.hours'),
      headerClassName: 'pb-3 pr-4 font-semibold text-text-primary text-right',
      render: (task) => <span className="block text-right text-text-secondary">{task.estimatedHours}h</span>,
    },
    {
      header: t('table.actions'),
      headerClassName: 'pb-3 font-semibold text-text-primary text-right',
      render: (task) => (
        <ActionButtons
          onEdit={() => modal.setEditing(task)}
          onDelete={() => modal.setDeleting(task)}
          editLabel={t('tasks.editTask')}
          deleteLabel={t('tasks.deleteTask')}
        />
      ),
    },
  ], [modal, t, locale]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">{t('tasks.title')}</h2>
          <p className="mt-1 text-sm text-text-secondary">{t('tasks.subtitle')}</p>
        </div>
        <Button onClick={modal.openCreate}>
          <span className="flex items-center gap-1.5">
            <PlusIcon />
            {t('tasks.addTask')}
          </span>
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-light">
              <TasksIcon className="h-7 w-7 text-accent" />
            </div>
          }
          title={t('tasks.noTasksYet')}
          description={t('tasks.noTasksDesc')}
          action={<Button onClick={modal.openCreate}>+ {t('tasks.createTask')}</Button>}
        />
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <select value={filters.status} onChange={(e) => updateFilter('status', e.target.value)} className={FILTER_SELECT_CLASSES}>
              {statusOptions.map((opt) => (
                <option key={opt.key} value={opt.key}>{opt.label}</option>
              ))}
            </select>

            <select value={filters.priority} onChange={(e) => updateFilter('priority', e.target.value)} className={FILTER_SELECT_CLASSES}>
              {priorityOptions.map((opt) => (
                <option key={opt.key} value={opt.key}>{opt.label}</option>
              ))}
            </select>

            <select value={filters.project} onChange={(e) => updateFilter('project', e.target.value)} className={FILTER_SELECT_CLASSES}>
              <option value="all">{t('tasks.allProjects')}</option>
              {taskProjects.map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>

            <select value={filters.assignee} onChange={(e) => updateFilter('assignee', e.target.value)} className={FILTER_SELECT_CLASSES}>
              <option value="all">{t('tasks.allAssignees')}</option>
              {assignees.map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>

            <span className="text-sm text-text-muted ml-auto">
              {t('common.countOf', { filtered: filteredTasks.length, total: tasks.length })}
            </span>
          </div>

          {/* Table */}
          {filteredTasks.length === 0 ? (
            <Card className="py-8 text-center">
              <p className="text-sm text-text-secondary">{t('tasks.noTasksMatch')}</p>
              <button
                onClick={clearFilters}
                className="mt-2 text-sm text-accent hover:underline cursor-pointer"
              >
                {t('common.clearFilters')}
              </button>
            </Card>
          ) : (
            <DataTable columns={columns} data={filteredTasks} keyExtractor={(t) => t.taskId} />
          )}
        </>
      )}

      {/* Create Task Modal */}
      <TaskFormModal
        isOpen={modal.createOpen}
        onClose={modal.closeCreate}
        onSaved={revalidate}
        projects={projects}
        userRole={currentUserRole}
        mode="create"
      />

      {/* Edit Task Modal */}
      {modal.editing && (
        <TaskFormModal
          isOpen={!!modal.editing}
          onClose={modal.closeEdit}
          onSaved={revalidate}
          projects={projects}
          initialData={modal.editing}
          userRole={currentUserRole}
          mode="edit"
        />
      )}

      {/* Delete Confirmation Modal */}
      {modal.deleting && (
        <ConfirmDeleteModal
          isOpen={!!modal.deleting}
          onClose={modal.closeDelete}
          title={t('tasks.deleteTask')}
          itemName={modal.deleting.title}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
