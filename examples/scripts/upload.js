(function() {

  'use strict';

  /**
   * Quick and dirty upload script to demonstrate uploading
   * a watermarked image.
   */

  /**
   * A variable for storing the cached target image
   */
  var original;


  /**
   * Enable fields identified by ids
   */
  function enableFields(ids) {
    ids.forEach(function(id) {
      document.getElementById(id).removeAttribute('disabled');
    })
  }

  /**
   * Given a file input, set the value of the readonly text input associated with it
   */
  function setText(input) {
    var group = input.parentNode.parentNode.parentNode;
    group.querySelector('.form-control').value = input.files[0].name;
  }

  /**
   * A listener that fires when the target image is selected
   */
  function setTarget(file) {
    enableFields(['watermark-button']);
    Array.prototype.forEach.call(document.querySelectorAll('input[type=radio]'), function (radio) {
      radio.removeAttribute('disabled');
    });
    watermark([file])
      .image(function(target) { return target;  })
      .then(function (img) {
        resetPreviewImage();
        document.getElementById('preview').appendChild(img);
      });
  }

  /**
   * A listener that fires when the watermark image has been selected
   */
  function setWatermark(file) {
    var preview = document.getElementById('preview'),
        img = document.getElementById('target').files[0],
        position = document.querySelector('input[type=radio]:checked').value;

    if (! original) {
      original = img;
    }

    watermark([original, file])
      .image(watermark.image[position](0.5))
      .then(function(marked) {

        resetPreviewImage();
        document.getElementById('preview').appendChild(marked);
      });
  }


  function resetPreviewImage()
  {
      var imageTag = document.querySelector("#preview img");
      if(imageTag != null)
      {
          imageTag.remove();
          original = null;
          setWatermark(document.getElementById("watermark").files[0]);

      }
  }

  /**
   * Check if the watermark has been selected
   */
  function isWatermarkSelected() {
    var watermark = document.getElementById('watermark-name');
    return !!watermark.value;
  }

  function upload(onProgress, onComplete, onError) {

    var img = document.querySelector('#preview img');

    watermark([img])
      .blob(function(target) { return target; })
      .then(function(blob) {

        const imageURL = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = imageURL
        link.download = 'watermarkedImage'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

      });
  }

  /**
   * Run the sample app once dom content has loaded
   */
  document.addEventListener('DOMContentLoaded', function () {

    /**
     * Handle file selections and position choice
     */
    document.addEventListener('change', function (e) {
      var input = e.target;

      if (input.type === 'file') {
        setText(input);
        input.id === 'target' ? setTarget(input.files[0]) : setWatermark(input.files[0]);
      }

      if (input.type === 'radio' && isWatermarkSelected()) {
        setWatermark(document.getElementById('watermark').files[0]);
      }
    });


    /**
     * Handle form submission - i.e actually do the upload
     */
    var form = document.getElementById('uploadForm');
    form.addEventListener('submit', function (e) {
      var progress = document.getElementById('progress'),
          bar = progress.querySelector('.progress-bar'),
          complete = document.getElementById('complete'),
          err = document.getElementById('error');

      progress.style.visibility = 'visible';

      upload(function(e) {
        if (e.lengthComputable) {
          var percent = (e.loaded / e.total) * 100;
          bar.style.width = percent + "%";
        }
      }, function () {
        complete.style.display = 'block';
        err.style.display = 'none';
      }, function () {
        err.style.display = 'block';
        complete.style.display = 'none';
      });

      e.preventDefault();
    });


  });


})();
