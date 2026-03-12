'use client';
import { Menu } from 'bloom-menu';

const itemStyles = "flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-neutral-900 hover:bg-neutral-100";

export default function BloomTriggerDemo() {
  return (
    <div className="w-full rounded-xl py-12 px-6 bg-neutral-900">
      <div className="flex items-center justify-center gap-16">
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs text-neutral-500 font-medium">Icon</span>
          <Menu.Root direction="bottom" anchor="center">
            <Menu.Container buttonSize={40} menuWidth={160} menuRadius={12} className="bg-white shadow-lg ring-1 ring-[#292929]/5">
              <Menu.Trigger>
                <div className="flex items-center justify-center w-10 h-10">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="4" r="1.5" fill="currentColor"/>
                    <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
                    <circle cx="10" cy="16" r="1.5" fill="currentColor"/>
                  </svg>
                </div>
              </Menu.Trigger>
              <Menu.Content className="p-2">
                <Menu.Item className={itemStyles} onSelect={() => {}}>Edit</Menu.Item>
                <Menu.Item className={itemStyles} onSelect={() => {}}>Copy</Menu.Item>
                <Menu.Item className={itemStyles} onSelect={() => {}}>Delete</Menu.Item>
              </Menu.Content>
            </Menu.Container>
          </Menu.Root>
        </div>

        <div className="flex flex-col items-center gap-3">
          <span className="text-xs text-neutral-500 font-medium">Text</span>
          <Menu.Root direction="bottom" anchor="center">
            <Menu.Container buttonSize={{ width: 100, height: 40 }} menuWidth={160} menuRadius={12} className="bg-white shadow-lg ring-1 ring-[#292929]/5">
              <Menu.Trigger>
                <div className="flex items-center justify-center w-full h-full rounded-full bg-white hover:bg-gray-50 transition-colors">
                  <span className="text-sm font-medium text-gray-700">Menu</span>
                </div>
              </Menu.Trigger>
              <Menu.Content className="p-2">
                <Menu.Item className={itemStyles} onSelect={() => {}}>Edit</Menu.Item>
                <Menu.Item className={itemStyles} onSelect={() => {}}>Copy</Menu.Item>
                <Menu.Item className={itemStyles} onSelect={() => {}}>Delete</Menu.Item>
              </Menu.Content>
            </Menu.Container>
          </Menu.Root>
        </div>
      </div>
    </div>
  );
}
