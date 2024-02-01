export default function ProductDetailsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="">
			<div className="">
				{children}
			</div>
		</section>
	);
}
