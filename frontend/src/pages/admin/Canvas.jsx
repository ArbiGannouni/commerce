import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ComponentRenderer from './ComponentRenderer';

const SortableComponent = ({ component, selected, onSelect, onDelete, showPreview }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: component.id
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`mb-4 ${!showPreview && selected ? 'ring-2 ring-primary rounded-lg' : ''}`}
        >
            {!showPreview && (
                <div className="flex items-center justify-between p-2 bg-zinc-200 dark:bg-zinc-800 rounded-t-lg">
                    <div
                        {...listeners}
                        {...attributes}
                        className="cursor-move flex items-center gap-2 flex-1"
                    >
                        <span className="material-symbols-outlined text-zinc-600 dark:text-zinc-400">
                            drag_indicator
                        </span>
                        <span className="font-medium text-sm text-zinc-900 dark:text-zinc-50 capitalize">
                            {component.type}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onSelect(component)}
                            className="p-1 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded"
                            title="Edit properties"
                        >
                            <span className="material-symbols-outlined text-sm text-blue-500">edit</span>
                        </button>
                        <button
                            onClick={() => onDelete(component.id)}
                            className="p-1 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded"
                            title="Delete component"
                        >
                            <span className="material-symbols-outlined text-sm text-red-500">delete</span>
                        </button>
                    </div>
                </div>
            )}
            <div className={!showPreview ? 'border-2 border-zinc-200 dark:border-zinc-800 rounded-b-lg' : ''}>
                <ComponentRenderer component={component} />
            </div>
        </div>
    );
};

const Canvas = ({ components, selectedComponent, onSelectComponent, onDeleteComponent, showPreview }) => {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-lg min-h-[600px] shadow-sm">
            {components.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-zinc-400">
                    <span className="material-symbols-outlined text-6xl mb-4">widgets</span>
                    <p className="text-lg font-medium">No components yet</p>
                    <p className="text-sm mt-2">Click components from the library to start building</p>
                </div>
            ) : (
                <div className={showPreview ? '' : 'p-4'}>
                    {components.map((component) => (
                        <SortableComponent
                            key={component.id}
                            component={component}
                            selected={selectedComponent?.id === component.id}
                            onSelect={onSelectComponent}
                            onDelete={onDeleteComponent}
                            showPreview={showPreview}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Canvas;
