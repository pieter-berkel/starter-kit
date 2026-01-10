import { Button } from "@workspace/ui/components/button";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { type MDXComponents, MDXRemote, type MDXRemoteOptions } from "next-mdx-remote-client/rsc";
import { client } from "@/lib/orpc";

export const dynamic = "force-static";

const listAllPublishedPages = async () => {
  const all: { slug: string }[] = [];
  let cursor: string | undefined;

  while (true) {
    const res: Awaited<ReturnType<typeof client.pages.list>> = await client.pages.list({
      pagination: { cursor, limit: 100 },
      filters: { published: true },
    });

    all.push(...res.data.map((p) => ({ slug: p.slug })));

    if (!res.meta.pagination.nextCursor) {
      break;
    }

    cursor = res.meta.pagination.nextCursor ?? undefined;
  }

  return all;
};

export async function generateStaticParams() {
  const pages = await listAllPublishedPages();

  return pages.map(({ slug }) => {
    const slugArray = (slug.charAt(0) === "/" ? slug.slice(1) : slug).split("/");
    return { slug: slugArray };
  });
}

export async function generateMetadata(props: PageProps<"/[[...slug]]">): Promise<Metadata> {
  const { slug: slugArray } = await props.params;
  const slug = slugArray ? `/${slugArray.join("/")}` : "/";

  let page: Awaited<ReturnType<typeof client.pages.get>>["data"] | null = null;
  try {
    const res = await client.pages.get({ slug });
    page = res.data;
  } catch {
    page = null;
  }

  if (!page?.published) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
  };
}

const components: MDXComponents = {
  Button,
};

export default async function Page(props: PageProps<"/[[...slug]]">) {
  const { slug: slugArray } = await props.params;
  const slug = slugArray ? `/${slugArray.join("/")}` : "/";

  let page: Awaited<ReturnType<typeof client.pages.get>>["data"] | null = null;
  try {
    const res = await client.pages.get({ slug });
    page = res.data;
  } catch {
    page = null;
  }

  if (!page?.published) {
    notFound();
  }

  const options: MDXRemoteOptions = {
    mdxOptions: {},
  };

  return <MDXRemote components={components} options={options} source={page.content} />;
}
