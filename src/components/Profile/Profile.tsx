import { Avatar, Tag, Text } from '@/components';
// import { CustomIcon } from '@/components/CustomIcon/CustomIcon';
import { cn, Icon } from '@/libs';
import { getStatusVariant } from '@/utils';

type Props = {
  name: string;
  businessName: string;
  status: string;
  children: React.ReactNode;
  className?: string;
  logo?: string;
};

type PaymentInformationProps = {
  iconName: string;
  iconBgColor: string;
  name: string;
  title: string;
  amount: string;
  image: string;
  children: React.ReactNode;
};

export const Profile = ({
  name,
  businessName,
  status,
  children,
  className,
  logo,
}: Readonly<Props>) => {
  return (
    <section className={cn('bg-white rounded-xl py-5', className)}>
      <div className="px-4 sm:px-6 flex flex-col xl:flex-row xl:items-start gap-6">
        <section className="flex flex-col sm:flex-row xl:flex-col items-center gap-4 xl:gap-6 shrink-0 xl:w-48">
          <Avatar
            name={name}
            src={logo}
            size="lg"
            className="rounded-xl flex justify-center items-center"
          />
          <div className="py-2.5 px-2 flex flex-col gap-2 text-center min-w-0">
            <Text
              variant="h4"
              weight="medium"
              className="text-gray-800 wrap-break-word"
            >
              {name}
            </Text>

            <div className="flex flex-col items-center gap-2">
              <Text
                variant="span"
                weight="normal"
                className="text-gray-500 wrap-break-word"
              >
                {businessName}
              </Text>
              <Tag value={status} variant={getStatusVariant(status)} />
            </div>
          </div>
        </section>
        <div className="w-full min-w-0 flex-1 xl:pl-6 xl:border-l xl:border-gray-100">
          {children}
        </div>
      </div>
    </section>
  );
};

export const PaymentInformation = ({
  iconName,
  iconBgColor,
  title,
  amount,
  image,
  children,
}: Readonly<PaymentInformationProps>) => {
  return (
    <section className="bg-primary-50 rounded-xl px-6 py-5 relative">
      <div className="flex items-center gap-6">
        <section className="flex flex-col gap-6 min-w-36">
          <div className={cn('rounded-full p-2 w-fit', iconBgColor)}>
            <Icon icon={iconName} className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col gap-1">
            <Text variant="span" weight="normal" className="text-gray-500">
              {title}
            </Text>
            <Text variant="h4" weight="normal" className="text-gray-800">
              {amount}
            </Text>
          </div>
        </section>

        <div className="pl-6 border-l border-gray-300">{children}</div>
      </div>
      <div className="absolute bottom-0 -right-5 flex items-center justify-center">
        <img src={image} alt={title} className="h-[147px]" />
      </div>
    </section>
  );
};
