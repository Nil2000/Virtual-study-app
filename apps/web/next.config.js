/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	transpilePackages: ["@repo/ui"],
	serverExternalPackages: ["@repo/db"],
};
