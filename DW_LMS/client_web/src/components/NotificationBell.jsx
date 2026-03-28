export default function NotificationBell() {
  return (
    <div className="relative cursor-pointer">
      🔔
      <span className="absolute -top-2 -right-2 bg-orange-500 text-black text-xs px-1 rounded-full">
        3
      </span>
    </div>
  );
}