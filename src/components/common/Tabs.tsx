import { Tab } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';

type TabItem = {
  label: string;
  icon?: ReactNode;
  content: ReactNode;
};

interface TabsProps {
  tabs: TabItem[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  return (
    <div className="panel12 w-full" id="line">
      <div className="mb-5 w-full">
        <Tab.Group>
          <Tab.List className="mt-3 flex flex-wrap border-b border-white-light dark:border-[#191e3a]">
            {tabs.map((tab, index) => (
              <Tab as={Fragment} key={index}>
                {({ selected }) => (
                  <button
                    className={`${
                      selected
                        ? 'text-secondary !outline-none before:!w-full'
                        : ''
                    } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:h-[1px] before:w-0 before:bg-secondary before:transition-all before:duration-700 hover:text-secondary hover:before:w-full`}
                  >
                    {tab.icon && <span className="ltr:mr-2 rtl:ml-2">{tab.icon}</span>}
                    {tab.label}
                  </button>
                )}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels>
            {tabs.map((tab, index) => (
              <Tab.Panel key={index}>
                <div className="pt-5">{tab.content}</div>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default Tabs;
