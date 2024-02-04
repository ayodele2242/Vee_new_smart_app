export default function AccountLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="w-full">
			<div className="">
				{children}
			</div>
		</section>
	);
}
