import { LucideIcon } from "lucide-react";

interface AdminCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  buttonText: string;
  iconColor: string;
  onAction: () => void;
}

export function AdminCard({
  title,
  description,
  icon: Icon,
  buttonText,
  iconColor,
  onAction,
}: AdminCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-md transition-shadow">
      <div className="flex flex-col items-start gap-4">
        <div
          className="p-3 rounded-lg"
          style={{ backgroundColor: `${iconColor}15` }}
        >
          <Icon className="w-8 h-8" style={{ color: iconColor }} />
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl mb-2 text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
        
        <button
          onClick={onAction}
          className="mt-2 px-6 py-2.5 rounded-md transition-opacity hover:opacity-90"
          style={{ 
            backgroundColor: iconColor,
            color: '#ffffff'
          }}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
