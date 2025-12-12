import { Button } from "@workspace/ui/components/button";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { type MDXComponents, MDXRemote, type MDXRemoteOptions } from "next-mdx-remote-client/rsc";
import { client } from "@/lib/orpc";

export const dynamic = "force-static";

const listAllPublishedPages = async () => {
  const all: { slug: string }[] = [];
  let cursor: string | null = null;

  while (true) {
    const res: Awaited<ReturnType<typeof client.pages.list>> = await client.pages.list({
      pagination: { cursor, limit: 100 },
      filter: { published: true },
      orderBy: ["createdAt:desc"],
    });

    all.push(...res.data.map((p) => ({ slug: p.slug })));

    if (!res.meta.pagination.nextCursor) {
      break;
    }

    cursor = res.meta.pagination.nextCursor;
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

  const { data } = await client.pages.list({
    pagination: { cursor: null, limit: 1 },
    filter: { published: true, slug },
  });

  const page = data[0] ?? null;

  if (!page) {
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

  const { data } = await client.pages.list({
    pagination: { cursor: null, limit: 1 },
    filter: { published: true, slug },
  });

  const page = data[0] ?? null;

  if (!page) {
    notFound();
  }

  const options: MDXRemoteOptions = {
    mdxOptions: {},
  };

  return <MDXRemote components={components} options={options} source={page.content} />;
}
