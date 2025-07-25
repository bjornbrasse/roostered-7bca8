import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function asyncMap<T, U>(
	iterable: Iterable<T>,
	asyncTransform: (item: T) => Promise<U>,
) {
	const promises = []
	for (const item of iterable) {
		promises.push(asyncTransform(item))
	}
	return Promise.all(promises)
}

