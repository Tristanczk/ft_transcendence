const PageTitle: React.FC<{ title: string }> = ({ title }) => (
    <h1 className="text-center text-xl md:text-2xl lg:text-4xl pb-4 font-extrabold dark:text-white">
        {title}
    </h1>
);

export default PageTitle;
