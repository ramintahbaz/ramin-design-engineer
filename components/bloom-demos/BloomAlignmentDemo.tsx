'use client';
import { Menu } from 'bloom-menu';

const itemStyles = "flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-neutral-900 hover:bg-neutral-100";
const alignments = ['start', 'center', 'end'] as const;
const labels = { start: 'Start', center: 'Center', end: 'End' };

export default function BloomAlignmentDemo() {
  return (
    <div className="w-full rounded-xl py-10 px-6 bg-neutral-900">
      <div className="flex items-end justify-center gap-12">
        {alignments.map((alignment) => (
          <div key={alignment} className="flex flex-col items-center gap-3">
            <span className="text-xs text-neutral-500 font-medium">{labels[alignment]}</span>
            <Menu.Root direction="bottom" anchor={alignment}>
              <Menu.Container buttonSize={36} menuWidth={130} menuRadius={10} className="bg-white shadow-lg ring-1 ring-[#292929]/5">
                <Menu.Trigger>
                  <div className="flex items-center justify-center w-9 h-9">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="4" r="1.5" fill="currentColor"/>
                      <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
                      <circle cx="10" cy="16" r="1.5" fill="currentColor"/>
                    </svg>
                  </div>
                </Menu.Trigger>
                <Menu.Content className="p-1.5">
                  <Menu.Item className={itemStyles} onSelect={() => {}}>Edit</Menu.Item>
                  <Menu.Item className={itemStyles} onSelect={() => {}}>Copy</Menu.Item>
                  <Menu.Item className={itemStyles} onSelect={() => {}}>Delete</Menu.Item>
                </Menu.Content>
              </Menu.Container>
            </Menu.Root>
          </div>
        ))}
      </div>
    </div>
  );
}
