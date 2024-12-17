<template>
    <footer class="border-t border-slate-800 mt-12">
        <div class="container mx-auto px-4 py-8">
            <div class="grid md:grid-cols-3 gap-8">
                <div>
                    <h3 class="text-white text-lg font-bold mb-4">About</h3>
                    <p class="text-slate-400 text-sm leading-relaxed">
                        A powerful tool for converting raster images to vectors and analyzing image metadata.
                        Built with modern web technologies.
                    </p>
                </div>

                <div>
                    <h3 class="text-white text-lg font-bold mb-4">Quick Links</h3>
                    <div class="flex flex-col space-y-2">
                        <a href="#" class="text-slate-400 hover:text-white transition-colors text-sm">
                            Documentation
                        </a>
                        <a href="#" class="text-slate-400 hover:text-white transition-colors text-sm">
                            API Reference
                        </a>
                        <a href="#" class="text-slate-400 hover:text-white transition-colors text-sm">
                            Examples
                        </a>
                    </div>
                </div>

                <div>
                    <h3 class="text-white text-lg font-bold mb-4">Connect</h3>
                    <div class="flex flex-col space-y-2">
                        <a href="https://github.com" target="_blank" rel="noopener"
                            class="text-slate-400 hover:text-white transition-colors text-sm inline-flex items-center gap-2">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                            </svg>
                            GitHub
                        </a>
                        <a href="mailto:support@example.com"
                            class="text-slate-400 hover:text-white transition-colors text-sm">
                            Contact Support
                        </a>
                    </div>
                </div>
            </div>

            <div class="mt-8 pt-8 border-t border-slate-800 text-center">
                <p class="text-slate-500 text-sm">
                    &copy; {{ new Date().getFullYear() }} Vexiform. All rights reserved.
                </p>
            </div>
        </div>
    </footer>
</template>