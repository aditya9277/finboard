"use client";

import { useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useDashboardStore } from "@/store/dashboardStore";
import { CardWidget, TableWidget, ChartWidget } from "@/components/widgets";
import type { WidgetConfig } from "@/types";

interface DashboardGridProps {
  onEditWidget: (widget: WidgetConfig) => void;
}

// Sortable widget wrapper component
function SortableWidget({
  widget,
  onEdit,
  onDelete,
}: {
  widget: WidgetConfig;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const theme = useDashboardStore((state) => state.theme);
  const isDark = theme === "dark";

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const renderWidget = () => {
    const props = { widget, onEdit, onDelete };

    switch (widget.type) {
      case "table":
        return <TableWidget {...props} />;
      case "chart":
        return <ChartWidget {...props} />;
      case "card":
      default:
        return <CardWidget {...props} />;
    }
  };

  // Determine widget size based on type
  const getWidgetClasses = (type: string) => {
    switch (type) {
      case "table":
        return "col-span-12 min-h-[400px]";
      case "chart":
        return "col-span-12 md:col-span-6 min-h-[320px]";
      case "card":
      default:
        return "col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3 min-h-[240px]";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${getWidgetClasses(widget.type)} relative group`}>
      {/* Drag handle - small icon in top-left corner */}
      <div
        {...attributes}
        {...listeners}
        className={`absolute top-2 left-2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing z-20 transition-opacity ${
          isDark
            ? "bg-slate-700 hover:bg-slate-600"
            : "bg-slate-200 hover:bg-slate-300"
        }`}
        title="Drag to reorder">
        <Bars3Icon
          className={`h-4 w-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}
        />
      </div>
      {renderWidget()}
    </div>
  );
}

export default function DashboardGrid({ onEditWidget }: DashboardGridProps) {
  const { dashboard, removeWidget, reorderWidgets } = useDashboardStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDeleteWidget = useCallback(
    (id: string) => {
      if (confirm("Are you sure you want to remove this widget?")) {
        removeWidget(id);
      }
    },
    [removeWidget],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = dashboard.widgets.findIndex((w) => w.id === active.id);
        const newIndex = dashboard.widgets.findIndex((w) => w.id === over.id);
        const newOrder = arrayMove(dashboard.widgets, oldIndex, newIndex);
        reorderWidgets(newOrder);
      }
    },
    [dashboard.widgets, reorderWidgets],
  );

  const widgetIds = dashboard.widgets.map((w) => w.id);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}>
      <SortableContext items={widgetIds} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-12 gap-4">
          {dashboard.widgets.map((widget) => (
            <SortableWidget
              key={widget.id}
              widget={widget}
              onEdit={() => onEditWidget(widget)}
              onDelete={() => handleDeleteWidget(widget.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
