import { createOrm } from './orm';
import { Doc, DocVersion } from './models';

async function main() {
  const orm = createOrm([DocVersion, Doc]);
  await orm.connect();
  console.log(orm.bone, 'bone');
  console.log(orm, 'orm');

  const createdDoc = await Doc.create({
    title: 'hello',
    content: '<div>hello</div>',
  });

  const createdOne = await DocVersion.create({
    doc_id: createdDoc.id,
    source: 'hello',
    html: '<div>hello</div>',
  });

  const docWithVersion = await Doc.include('doc_versions');
  console.log(docWithVersion[0].doc_versions, 'included doc with version');

  console.log(createdOne, 'createdDocV', createdOne.source);

  const newOne = await DocVersion.findOne(createdOne.id);
  console.log(newOne, 'newOne', newOne.source);

  await createdOne.update({
    source: 'world',
  });

  const updateOne = await DocVersion.findOne(createdOne.id);
  console.log(updateOne, 'updateOne', updateOne.source);

  // search
  const searchedOne = await DocVersion.findOne({
    source: {
      $or: ['hello', { $like: '%wo%' }],
    },
  });
  console.log(searchedOne, 'searchedOne', searchedOne.source);

  setTimeout(async () => {
    // await createdOne.remove();
    // const deleteOne = await DocVersion.findOne(createdOne.id);
    // console.log(deleteOne, 'deleteOne');
  }, 1000);
}

main();
