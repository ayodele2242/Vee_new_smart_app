export default function CartLayout({
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
