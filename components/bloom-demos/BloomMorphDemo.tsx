'use client';
import { Menu } from 'bloom-menu';

const itemStyles = "flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-neutral-900 hover:bg-neutral-100";

export default function BloomMorphDemo() {
  return (
    <div className="w-full flex items-center justify-center py-12 rounded-xl bg-neutral-900">
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
            <Menu.Item className={itemStyles} onSelect={() => {}}>Rename</Menu.Item>
            <Menu.Item className={itemStyles} onSelect={() => {}}>Duplicate</Menu.Item>
            <Menu.Item className={itemStyles} onSelect={() => {}}>Delete</Menu.Item>
          </Menu.Content>
        </Menu.Container>
      </Menu.Root>
    </div>
  );
}
